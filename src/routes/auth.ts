import { Router } from 'express';
import * as userController from '../controller/userController'
import * as tokenController from '../controller/refreshTokenController'

const router = Router();

router 
    .route('/signup')
    .post(userController.signup)

router
    .route('/signin')
    .post(userController.signin)

router
    .route('/refreshToken')
    .post(tokenController.verifyToken)
    .delete(tokenController.logout)

export default router;