package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.util.Random

object ReviewingAPie {
  private val searchData = csv("gatling/data/search.csv").circular
  private val reviewsData = csv("gatling/data/reviews.csv").circular

  val review = exec(
    feed(searchData)
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
    .exec { session => session.set("uuid", Random.shuffle(session("uuids").as[Seq[String]]).head) }
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
  )
}
