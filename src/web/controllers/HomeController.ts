import { controller, httpGet } from "inversify-express-utils";
import { BaseController } from "./BaseController";

@controller("/")
class HomeController extends BaseController {
  @httpGet("/")
  public async get() {
    return this.ok({ data: `Welcome Api` });
  }
}
