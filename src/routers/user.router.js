import { Router  } from "express";
import { registeruser } from "../controllers/user.controllers.js";



const route = Router();

route.route ("/register").post(registeruser);


 export default route;