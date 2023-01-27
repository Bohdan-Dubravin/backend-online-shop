import PostService from '../services/postService.js'
import ApiError from '../utils/apiError.js'

class PostsController {
  async getAllPosts(req, res, next) {
    const tag = req.query.tag

    const posts = await PostService.getAllPosts(tag)

    res.status(200).json(posts)
    try {
    } catch (error) {
      next(error)
    }
  }
  async getPost(req, res, next) {
    try {
      const { id } = req.params

      const post = await PostService.getPost(id)

      if (!post) {
        throw ApiError.BadRequest('Post not found')
      }

      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async createPost(req, res, next) {
    try {
      const newPost = await PostService.createPost(req.body)

      res.status(200).json(newPost)
    } catch (error) {
      next(error)
    }
  }

  async updatePost(req, res, next) {
    try {
      const { id } = req.params
      const posts = await PostService.updatePost(id, req.id)

      res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  }

  async deletePost(req, res, next) {
    const { id } = req.params
    try {
      const post = await PostService.deletePost(id)

      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async updatePost(req, res, next) {
    const { id } = req.params
    try {
      const post = await PostService.updatePost(id, req.body)

      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const comment = await PostService.addComment(id, userId, req.body)

      res.status(200).json(comment)
    } catch (error) {
      next(error)
    }
  }
  async likePost(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const likedPost = await PostService.likePost(id, userId)
      res.status(200).json(likedPost)
    } catch (error) {
      next(error)
    }
  }

  async dislikePost(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const likedPost = await PostService.dislikePost(id, userId)

      res.status(200).json(likedPost)
    } catch (error) {
      next(error)
    }
  }

  async getTags(req, res, next) {
    try {
      const tags = await PostService.getTags()
      res.status(200).json(tags)
    } catch (error) {
      next(error)
    }
  }
}

export default new PostsController()
