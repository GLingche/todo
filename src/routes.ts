import { authRoute } from '@auth/routes/authRoutes';
import { Application } from 'express';
import { currentUserRoutes } from '@auth/routes/currentRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { moduleRoutes } from '@module/routes/moduleRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
  const routes = () => {
    app.use(BASE_PATH, authRoute.routes());
    app.use(BASE_PATH, authRoute.signoutRoute());
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
    app.use(BASE_PATH,authMiddleware.verifyUser,moduleRoutes.routes());
  };

  routes();
};
