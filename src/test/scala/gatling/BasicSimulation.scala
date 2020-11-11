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

  val browsers = scenario("Browsers")
    .exec(SearchBrowsing.browse)

  setUp(
    // reviewers.inject(atOnceUsers(1))
    browsers.inject(atOnceUsers(1))
  ).protocols(
    if (useProxy.toBoolean) httpProtocol.proxy(Proxy(proxyHost, proxyPort.toInt)) else httpProtocol
  ).assertions(
    global.successfulRequests.percent.is(100)
  )
}