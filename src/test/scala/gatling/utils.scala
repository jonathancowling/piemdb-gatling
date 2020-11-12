package gatling
import io.gatling.commons
import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder
import io.gatling.commons.util.TypeCaster
import scala.reflect.ClassTag
import io.gatling.commons.NotNothing

package object utils {
  def debug = exec { session => println(session); session }
  def debug[T: TypeCaster: ClassTag: NotNothing](s: String) = exec { session => println(session(s).as[T]); session }

  //FIXME: these don't work for some unknown reason
  implicit class DebugChainBuilder(c: ChainBuilder) {
    def debug = exec(utils.debug)
    def debug[T: TypeCaster: ClassTag: NotNothing](s: String) = exec(utils.debug(s))
  }
}