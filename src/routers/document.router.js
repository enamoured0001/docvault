import jwtverify from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isadmin.middlware.js";
import { Router  } from "express";
import { uploadDocument } from "../controllers/document.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";  

const route = Router();
route.route("/upload/:memberid").post(jwtverify, isAdmin, upload.fields([{ name: "document", maxCount: 1 }]), uploadDocument);
route.route("/member/:memberid").get(jwtverify, isAdmin, getDocumentsByMember);
route.route("/:documentid").delete(jwtverify, isAdmin, removeDocument);

export default route;