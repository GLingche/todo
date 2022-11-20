import {Add} from '@module/controllers/add';
import express,{Router} from 'express';
import {Get} from '@module/controllers/get'
import { authMiddleware } from '@global/helpers/auth-middleware';
class ModuleRoutes {
  private router:Router;

  constructor() {
    this.router = express.Router()
  }

  public routes():Router {
    this.router.post('/addModule',Add.prototype.create);
    this.router.get('/getModule',authMiddleware.checkAuthentication,Get.prototype.read);
    return this.router;
  }

}

export const moduleRoutes:ModuleRoutes = new ModuleRoutes();
