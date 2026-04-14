import { Router  } from "express";
import { registeruser,loginuser,logoutuser, updatedrefreshtoken, getCurrentuser, updateCurrentuser, verifyEmailOtp, resendEmailOtp } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import jwtverify from "../middlewares/auth.middleware.js";


const route = Router();

route.route ("/register").post(
    
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
       
    ]),
    registeruser
);
route.route ("/login").post(loginuser);
route.route("/verify-email").post(verifyEmailOtp);
route.route("/resend-verification-otp").post(resendEmailOtp);
route.route("/logout").post(jwtverify, logoutuser);
route.route("/refresh").post(updatedrefreshtoken);
route.route("/me").get(jwtverify, getCurrentuser).patch(
    jwtverify,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    updateCurrentuser
);

 export default route;
