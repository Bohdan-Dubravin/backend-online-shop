import { Router } from 'express';
import postController from '../controllers/postController.js';
import checkAuth from '../middleware/checkAuth.js';
import { postValidation } from '../validations/Validations.js';

const postRouter = new Router();

postRouter.get('/', postController.getAllPosts);
postRouter.get('/:id', postController.getPost);
postRouter.post(
  '/create',
  checkAuth,
  postValidation,
  postController.createPost
);
postRouter.patch('/update/:id', checkAuth, postController.updatePost);
postRouter.delete('/delete/:id', checkAuth, postController.deletePost);

export default postRouter;
