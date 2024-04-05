import express from 'express';
import { register, signIn , forgetPass} from '../controllers/user.js';

const UserRoutes = express.Router();

UserRoutes.post("/register", register);
UserRoutes.post("/signIn", signIn);
UserRoutes.post("/forgetPassword", forgetPass);


export default UserRoutes;