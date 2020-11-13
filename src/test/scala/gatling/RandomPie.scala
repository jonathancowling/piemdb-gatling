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
        status.is(200),
        jsonPath("$").count.gt(0),
        jsonPath("$").saveAs("uuid")
      )
  )
  .exitHereIfFailed
  .pause(2)
  .exec(
    http("Go to Random Pie Page")
      .get("/pie/${uuid}")
      .check(status.is(200))
  )
}
