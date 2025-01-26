import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  '/login',
//   validateRequest(AuthValidation.loginUserValidationSchema),
  authController.loginUser,
);

export const authRoutes = router;
