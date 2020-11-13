package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import io.gatling.commons.validation.Validation
import io.gatling.core.check.Validator
import io.gatling.commons.validation._

object SubmitAPie {
  private val searchData = csv("gatling/data/search.csv").circular
  private val submitPie = csv("gatling/data/pies.csv").circular

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