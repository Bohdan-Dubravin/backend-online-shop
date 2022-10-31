import { nextDay } from 'date-fns/esm';
import postService from '../services/postService.js';

class PostsController {
  async createPost(req, res, next) {
    try {
      const newPost = await postService.createPost(req.body);

      res.status(200).json(newPost);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostsController();
