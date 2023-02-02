import { Add } from '@cardItem/controllers/add';
import {Get} from '@cardItem/controllers/get';
import express,{Router} from 'express';
// import {Get} from '@module/controllers/get'
import { authMiddleware } from '@global/helpers/auth-middleware';
class CardItemRoutes {
  private router:Router;

  constructor() {
    this.router = express.Router()
  }

  public routes():Router {
    this.router.post('/addCardItem',Add.prototype.create);
    this.router.get('/getCardItem',authMiddleware.checkAuthentication,Get.prototype.read);
    return this.router;
  }

}

export const cardItemRoutes:CardItemRoutes = new CardItemRoutes();
