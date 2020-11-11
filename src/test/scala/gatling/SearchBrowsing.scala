package gatling
import io.gatling.commons.validation._
import io.gatling.core.Predef._
import io.gatling.http.Predef._
import java.{util => ju}
import io.gatling.core.check.Validator

sealed class UUIDValidator extends Validator[String] {
  val name = "uuid regex" 
  private val regexMatch = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}".r
  override def apply(actual: Option[String], displayActualValue: Boolean): Validation[Option[String]] = {
    return actual match {
      case `regexMatch` => Success(actual)
      case _ => Failure(s"""string "$actual" is not a valid uuid""")
    }
  }
}

sealed class UUIDSeqValidator extends Validator[Seq[String]] {
  val name = "uuid regex seq"
  private val uuidValidator = new UUIDValidator
  override def apply(actual: Option[Seq[String]], displayActualValue: Boolean): Validation[Option[String]] = {
    return  actual match {
      case Some(uuidList) => 
        val (successes, failures): (Seq[Some[String]], Seq[None]) = uuidList.map {
          uuid => uuidValidator(Some(uuid), displayActualValue).toOption.flatten
        }.partition {
          it => it.isDefined
        }
        if (failures.isEmpty) successes.success else "".failure
      // .reduce(Success(Seq.empty)) { (acc, validation) =>
      //   acc.map { seq =>
      //     validation match {
      //       case Success(uuid) => Success(seq + uuid)
      //       case Failure => validation
      //     }
      //   }
      // }
      case None => "No items in sequence".failure
    }
  }
}

// abstract class SeqValidator[T] extends Validator[Seq[T]] {
//   val itemValidator: Validator[T]
//   override def apply(actual: Option[Seq[T]], displayActualValue: Boolean): Validation[Option[Seq[T]]] = {
//     val result = actual.map { seq =>
//       seq.map[Validation[Option[T]], Seq[Validation[Option[T]]]] { t =>
//         itemValidator.apply(Some(t), displayActualValue)
//       }
//       .map[Validation[Seq[Option[T]]], Seq[Seq[Validation[Option[T]]]]] { t => Seq(t) }
//       .fold {

//       }
//       // seq.reduce[Option[Seq[T]]](Some(Seq.empty[T])) {
//       //   (acc: Validation[Option[T]], cur: T) => acc.map(_ => itemValidator.apply(Some(cur), displayActualValue))
//       // }
//     } getOrElse None

//     return result.flatMap { _ =>
//       _ match {
//         case Some => Success(_)
//         case None => Failure("msg")
//       }
//     }    
//   }
// }

object SearchBrowsing {
  private val searchData = Array(
    Map("searchs" -> Array(
        "pie",
        "Leeds",
        "veg",
        "Not bad",
        "Best pie",
        "Tasty",
        "Good service",
        "Favourite",
    ))
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
      .check(
        status.is(200),
        jsonPath("$").validate(new UUIDValidator)
      )
  )
  .pause(1)
  .feed(searchData)
  .exec { session => session.set("search", session("${searchs.random()}").as[String]) }
  .exec(
    http("Search")
      .get("/search/${search}")
      .check(
        status.is(200),
        jsonPath("$[*]").count.gt(0),
        jsonPath("$[*]").findAll.saveAs("uuids"),
        jsonPath("$[*]").findAll.validate(new UUIDSeqValidator)
      )
  )
  .repeat(3) {
    exitHereIfFailed
    .foreach(
      "${uuids}",
      "uuid"
    ) {
      exec(
        http("Get Pie")
          .get("/pie/${uuid}")
          .check(
            status.is(200),
            jsonPath("$.uuid").validate(new UUIDValidator),
            jsonPath("$.name").ofType[String],
            jsonPath("$.description").ofType[String],
            jsonPath("$.date-posted").ofType[String],
            jsonPath("$.location").ofType[String],
            jsonPath("$.establishment").ofType[String],
            jsonPath("$.cost").ofType[String],
            jsonPath("$.recipe-link").ofType[String],
            jsonPath("$.image").ofType[String]
          )
      )
    }
    .pause(3)
    .exec { session => session.set("uuid", session("${uuids.random()}").as[String]) }
    .exec(
      http("Get Chosen Pie")
        .get("/pie/${uuid}")
        .check(
          status.in(200, 304),
          jsonPath("$.uuid").validate(new UUIDValidator),
            jsonPath("$.name").ofType[String],
            jsonPath("$.description").ofType[String],
            jsonPath("$.date-posted").ofType[String],
            jsonPath("$.location").ofType[String],
            jsonPath("$.establishment").ofType[String],
            jsonPath("$.cost").ofType[String],
            jsonPath("$.recipe-link").ofType[String],
            jsonPath("$.image").ofType[String]
        )
    )
  }
  
}