package gatling
import io.gatling.core.Predef._
import io.gatling.http.Predef._

object SubmitAPie {
  private val submitPie = csv("gatling/data/pies.csv").circular

  val submit = exec(
  feed(submitPie)
  .exec(
    http("Submit a Pie")
      .put("/submitPie")
      .body(StringBody("""{
        "pieData": {
          "name": "${name}",
          "descritpion": "${description}",
          "location": "${location}",
          "image": "${image}"
        },
        "token": "anything"
      }
      """))
      .check(
        status.is(200),
        jsonPath("$").validate(new UUIDValidator),
        jsonPath("$").saveAs("uuid")
      )
  )
  .exitHereIfFailed
  .exec(
    http("Get submitted pie")
      .get("/pie/${uuid}")
      .check(
        status.is(200),
        jsonPath("$.uuid").validate(new UUIDValidator)
      )
    )
    .exec(
    http("Get reviews")
      .get("/review/${uuid}")
      .check(status.in(200, 304))
    )
  )
}
