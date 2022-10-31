import postService from "../services/postService.js";

class PostsController {
  async getAllPosts(req, res, next) {
    const posts = await postService.getAllPosts();

    res.status(200).json(posts);
    try {
    } catch (error) {
      next(error);
    }
  }
  async getPost(req, res, next) {
    try {
      const { id } = req.params;

      const post = await postService.getPost(id);
      console.log(post, "outsidefinction");
      res.status(200).json({ post });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async createPost(req, res, next) {
    try {
      const newPost = await postService.createPost(req.body);

      res.status(200).json(newPost);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    try {
      const posts = await postService.getPosts(req.id);

      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const posts = await postService.getPosts(req.id);

      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostsController();
