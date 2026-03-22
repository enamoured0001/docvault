import { Router  } from "express";
import { createfamily,getMyFamily, joinFamily, addMemberToFamily, removeMemberFromFamily} from "../controllers/family.controllers.js";
import jwtverify from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isadmin.middlware.js";

const route = Router();

route.route("/create").post(jwtverify, createfamily);
route.route("/myfamily").get(jwtverify, getMyFamily);
route.route("/join").post(jwtverify, joinFamily);
route.route("/addmember").post(jwtverify,isAdmin, addMemberToFamily);
route.route("/removemember/:memberid").delete(jwtverify,isAdmin, removeMemberFromFamily);

 export default route;
