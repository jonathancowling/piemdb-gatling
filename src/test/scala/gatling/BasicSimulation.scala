package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import io.gatling.commons.validation.Validation
import io.gatling.core.check.Validator
import io.gatling.commons.validation._

object ReviewingAPie {
  private val searchData = csv("gatling/data/search.csv")
  private val reviewsData = csv("gatling/data/reviews.csv")

  val review = exec(
    http("Home")
      .get("/randomPie")
      .check(status.is(200))
  )
  .pause(1)
  .feed(searchData.random.circular)
  .exec(
    http("Search")
      .get("/search/${search}")
      .check(
        status.is(200),
        jsonPath("$[*]").count.gt(0),
        jsonPath("$[*]").findAll.saveAs("uuids")
      )
  )
  .exitHereIfFailed
  .foreach(
    "${uuids}",
    "uuid"
  ) {
    exec(
      http("Get Pie")
        .get("/pie/${uuid}")
        .check(status.is(200))
    )
  }
  .pause(3)
  .exec { session => session.set("uuid", session("${uuids.random()}").as[String]) }
  .exec(
    http("Get Chosen Pie")
      .get("/pie/${uuid}")
      .check(status.in(200, 304))
  )
  .pause(3)
  .feed(reviewsData.random.circular)
  .exec(
    http("Submit Review")
      .put("/review")
      .body(StringBody("""{
      "review": {
        "uuid": "${uuid}",
        "name": "${name}",
        "review-text": "${review-text}"
      },
      "token": ""
      }"""))
      .check(status.is(200))
  )
}
object SubmitAPie {
  private val searchData = Array(
    Map("search" -> "pie")
  )
  private val submitPie = Array(
    Map(
        "name" -> "Arman's Pie",
        "description" -> "Signature pie from armans household",
        "location" ->  "California"
      )
  )

  val submit = exec(
      http("Home")
      .get("/randomPie")
      .check(status.is(200))
  )
  .pause(1)
  .feed(searchData)
  .exec(
    http("Search")
      .get("/search/${search}")
      .check(
        status.is(200)
      )
  )
  .exitHereIfFailed
  .pause(3)
  .feed(submitPie)
  .exec(
    http("Submit a Pie")
      .put("/submitPie")
      .body(StringBody("""{
        "pieData": {
          "name": "${name}",
          "descritpion": "${description}",
          "location": "${location}"
        },
        "token": "anything"
      }
      """))
      .check(
        status.is(200),
        jsonPath("$").exists,
        jsonPath("$").saveAs("uuid")
      )
  )
  .pause(2)
  .exitHereIfFailed
  .exec(
    http("Get submitted pie")
      .get("/pie/${uuid}")
      .check(status.is(200))
  )
}

class BasicSimulation extends Simulation {

  val properties = new ju.Properties()
  properties.load(
    getClass().getClassLoader().getResourceAsStream("gatling/gatling.properties")
  )

  val useProxy = properties.getProperty("proxy.enabled", "false")
  val proxyHost = properties.getProperty("proxy.host", "localhost")
  val proxyPort = properties.getProperty("proxy.port", "8080")

  val httpProtocol = http
    .baseUrl("http://localhost:3000")
    .contentTypeHeader("application/json")
    .acceptHeader("application/json")

  val reviewers = scenario("Reviewers")
    .exec(ReviewingAPie.review)
  
  val submit = scenario("Submit")
    .exec(SubmitAPie.submit)

  setUp(
    reviewers.inject(atOnceUsers(1)),
    submit.inject(atOnceUsers(1))
  ).protocols(
    if (useProxy.toBoolean) httpProtocol.proxy(Proxy(proxyHost, proxyPort.toInt)) else httpProtocol
  ).assertions(
    global.successfulRequests.percent.is(100)
  )
}
