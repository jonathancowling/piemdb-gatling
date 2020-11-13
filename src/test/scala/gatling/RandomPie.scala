package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import io.gatling.commons.validation.Validation
import io.gatling.core.check.Validator
import io.gatling.commons.validation._

object RandomPie {
  val random = exec(
      http("Home")
      .get("/randomPie")
      .check(
        status.in(200, 304),
        jsonPath("$").validate(new UUIDValidator),
        jsonPath("$").saveAs("uuid")
      )
  )
  .exitHereIfFailed
  .pause(2)
  .exec(
    http("Go to Random Pie Page")
      .get("/pie/${uuid}")
      .check(
        status.in(200, 304),
        jsonPath("$.uuid").validate(new UUIDValidator)
      )
  )
  .exec(
    http("Get reviews")
      .get("/review/${uuid}")
      .check(status.in(200, 304))
    )
}
