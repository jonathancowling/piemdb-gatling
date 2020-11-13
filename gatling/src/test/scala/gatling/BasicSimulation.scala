package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}

object GoHome { 
  val getRandom = exec(
    http("Home")
    .get("/randomPie")
    .check(
      status.is(200),
      jsonPath("$").validate(new UUIDValidator)
    )
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
    .exec(GoHome.getRandom)
    .pause(1)
    .exec(ReviewingAPie.review)
  
  val submit = scenario("Submit")
    .exec(GoHome.getRandom)
    .pause(1)
    .exec(SubmitAPie.submit)

  val browsers = scenario("Browsers")
    .exec(GoHome.getRandom)
    .pause(1)
    .exec(repeat(3) {SearchBrowsing.browse})

  val readReview = scenario("Reading")
    .exec(GoHome.getRandom)
    .pause(1)
    .exec(repeat(3) {ReadingReview.read})

  val randomPie = scenario("Random")
    .exec(repeat(3) {RandomPie.random})

  setUp(
    reviewers.inject(atOnceUsers(1)),
    submit.inject(atOnceUsers(1)),
    readReview.inject(atOnceUsers(1)),
    randomPie.inject(atOnceUsers(1))
  ).protocols(
    if (useProxy.toBoolean) httpProtocol.proxy(Proxy(proxyHost, proxyPort.toInt)) else httpProtocol
  ).assertions(
    global.successfulRequests.percent.is(100)
  )
}
