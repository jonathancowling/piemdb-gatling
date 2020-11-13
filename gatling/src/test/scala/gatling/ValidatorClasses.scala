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
      case Some(input) if regexMatch.pattern.matcher(input).matches => Success(actual)
      case _ => Failure(s"""string "$actual" is not a valid uuid""")
    }
  }
}

sealed class UUIDSeqValidator extends Validator[Seq[String]] {
  val name = "uuid regex seq"
  private val uuidValidator = new UUIDValidator
  override def apply(actual: Option[Seq[String]], displayActualValue: Boolean): Validation[Option[Seq[String]]] = {
    return  actual match {
      case Some(uuidList) =>
        val (successes, failures): (Seq[Option[String]], Seq[Option[String]]) = uuidList.map {
          uuid => uuidValidator(Some(uuid), displayActualValue).toOption.flatten
        }.partition {
          it => it.isDefined
        }
        if (failures.isEmpty) Some(successes.map(_.get)).success else "".failure
      case None => "No items in sequence".failure
    }
  }
}
