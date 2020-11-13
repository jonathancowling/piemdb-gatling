package gatling
import scala.util.Random
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import gatling.utils.debug

object SearchBrowsing {
  private val searchData = csv("gatling/data/search.csv").circular

  val browse =
  feed(searchData)
  .exec(
    http("Search")
      .get("/search/${search}")
      .check(
        status.in(200, 304),
        jsonPath("$[*]").count.gt(0),
        jsonPath("$[*]").findAll.saveAs("uuids"),
        jsonPath("$[*]").findAll.validate(new UUIDSeqValidator)
      )
  )
  .exitHereIfFailed
  .foreach(
    "${uuids}",
    "uuid"
  ) {
    exec(
      http("Get Pies")
        .get("/pie/${uuid}")
        .check(
          status.in(200, 304),
          jsonPath("$.uuid").validate(new UUIDValidator)
        )
    )
  }
  .pause(3)
  .exec { session => session.set("uuid", Random.shuffle(session("uuids").as[Seq[String]]).head) }
  .exitHereIfFailed
  .exec(
    http("Get Chosen Pie")
      .get("/pie/${uuid}")
      .check(
        status.in(200, 304),
        jsonPath("$.uuid").validate(new UUIDValidator)
      )
  )
  .exec(
    http("Get Reviews for Chosen Pie")
      .get("/review/${uuid}")
      .check(status.in(200, 304))
  )  
}
