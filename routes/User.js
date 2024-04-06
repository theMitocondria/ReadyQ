import express from 'express';
import { register, signIn , forgetPass} from '../controllers/user.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const UserRoutes = express.Router();

UserRoutes.post("/register", register);
UserRoutes.post("/signIn", signIn);
UserRoutes.post("/forgetPassword", forgetPass);


//url bnega github interview ka

//url bnega natural interview ka check dlega islogged in ka

export default UserRoutes;