package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import io.gatling.commons.validation.Validation
import io.gatling.core.check.Validator
import io.gatling.commons.validation._
import scala.util.Random

object ReadingReview {
  private val searchData = csv("gatling/data/search.csv").circular

  val read = exec(
  feed(searchData)
  .exec(
    http("Search")
      .get("/search/${search}")
      .check(
        status.in(200, 304),
        jsonPath("$[*]").count.gt(0),
        jsonPath("$[*]").findAll.validate(new UUIDSeqValidator),
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
        .check(
          status.in(200, 304),
          jsonPath("$.uuid").validate(new UUIDValidator)
        )
    )
  }
  .pause(3) // time to choose a pie
  .exec { session => session.set("uuid", Random.shuffle(session("uuids").as[Seq[String]]).head) }
  .exec(
    http("Get Chosen Pie")
      .get("/pie/${uuid}")
      .check(
        status.in(200, 304),
        jsonPath("$.uuid").validate(new UUIDValidator)
      )
  )
  .exec(
    http("Get review")
      .get("/review/${uuid}")
      .check(status.in(200, 304))
    )
  )
}
