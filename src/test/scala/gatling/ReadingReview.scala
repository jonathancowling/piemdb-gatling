package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import io.gatling.commons.validation.Validation
import io.gatling.core.check.Validator
import io.gatling.commons.validation._

object ReadingReview {
  private val searchData = csv("gatling/data/search.csv")

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