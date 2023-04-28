import { Router } from "express";
import * as chatController from '../controller/chatController'

const router = Router();

router
    .route('/message')
    .get(chatController.getMessages)
    .post(chatController.sendMessage)

export default router;