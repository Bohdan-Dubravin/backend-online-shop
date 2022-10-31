import { Router } from "express";
import postContoller from "../controllers/postContoller.js";
import checkAuth from "../middleware/checkAuth.js";
import { postValidation } from "../validations/Validations.js";

const postRouter = new Router();

postRouter.get("/", postContoller.getAllPosts);
postRouter.get("/:id", postContoller.getPost);
postRouter.post("/create", checkAuth, postValidation, postContoller.createPost);
postRouter.patch("/update/:id", checkAuth, postContoller.updatePost);
postRouter.delete("/delete/:id", checkAuth, postContoller.deletePost);

export default postRouter;
