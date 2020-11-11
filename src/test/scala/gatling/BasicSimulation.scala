package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}

object ReviewingAPie {
  private val searchData = Array(
    Map("search" -> "pie")
  )
  private val reviewsData = Array(
    Map(
      "name" -> "some review",
      "review-text" -> "this pie is awesome"
    )
  )

  val review = exec(
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
        status.is(200),
        jsonPath("$[*]").count.gt(0),
        jsonPath("$[*]").findAll.saveAs("uuids") // FIXME
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
      .check(status.is(200))
  )
  .pause(3)
  .feed(reviewsData.random.circular)
  .exec(
    http("Submit Review")
      .post("/review")
      .body(StringBody("""{
        "uuid": "${uuid}",
        "name": "${name}",
        "review-text": "${review-text}"
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
        jsonPath("$").count.gt(0),
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
object ReadingReview {
   private val searchData = Array(
    Map("search" -> "pie")
  )
  val read = exec(
      http("Home")
      .get("/randomPie")
      .check(status.is(200))
  )
  .pause(3)
  .feed(searchData)
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
      http("Get pie")
        .get("/pie/${uuid}")
        .check(status.is(200))
    )
  }
  .exec(
    http("Get review")
      .get("/review/${uuid}")
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

  val readReview = scenario("Reading")
    .exec(ReadingReview.read)

  setUp(
    reviewers.inject(atOnceUsers(1)),
    submit.inject(atOnceUsers(1)),
    readReview.inject(atOnceUsers(1))
  ).protocols(
    if (useProxy.toBoolean) httpProtocol.proxy(Proxy(proxyHost, proxyPort.toInt)) else httpProtocol
  )
}