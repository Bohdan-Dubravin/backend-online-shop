import CommentPostSchema from '../models/CommentPostSchema.js'
import PostModel from '../models/PostModel.js'
import UserModel from '../models/UserModel.js'
import ApiError from '../utils/apiError.js'

class PostService {
  async getAllPosts() {
    const posts = await PostModel.find()
      .populate('user', 'username avatarUrl likes dislikes')
      .exec()

    return posts
  }

  async getPost(postId) {
    if (!postId) {
      throw ApiError.BadRequest('Invalid id')
    }
    const foundPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: 'after' }
    )
      .populate('user', '-password')
      .populate('comments')

    return foundPost
  }

  async createPost(post) {
    const { userId, title, text, imageUrl, tags } = post

    if (!userId || !title || !text) {
      throw ApiError.BadRequest('Enter all fields')
    }

    const newPost = await PostModel.create({
      title,
      text,
      imageUrl,
      tags,
      user: userId,
    })

    await UserModel.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    })

    return newPost
  }

  async deletePost(postId) {
    try {
      if (!postId) {
        throw ApiError.BadRequest('Invalid id')
      }

      const post = await PostModel.findByIdAndDelete(postId).lean().exec()

      if (!post) {
        throw ApiError.BadRequest("Post don't exist")
      }

      return post
    } catch (error) {
      throw ApiError.BadRequest("Can't delete post")
    }
  }

  async updatePost(postId, post) {
    const { title, text, userRole, userId } = post

    // if (userRole !== 'admin') {
    //   const oldPost = await PostModel.findById(postId).lean().exec()
    //   if (oldPost.user.toString() !== userId) {
    //     throw ApiError.BadRequest('Admin Permission required')
    //   }
    // }

    if (!title || !text) {
      throw ApiError.BadRequest('Required all fields')
    }

    const updatedPost = PostModel.findByIdAndUpdate(postId, {
      $set: { ...post },
    })

    if (!updatedPost) {
      throw ApiError.BadRequest('Post no found')
    }

    return updatedPost
  }

  async addComment(postId, userId, post) {
    const { rating, text } = post

    const comment = await CommentPostSchema.create({
      text,
      rating,
      author: userId,
      post: postId,
    })

    if (!comment) {
      throw ApiError.BadRequest('Comment was not created')
    }

    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: { $each: [comment._id], $position: 0 } },
    })

    return comment
  }

  async likePost(postId, userId) {
    const user = await UserModel.findById(userId)
    if (user.likes.some((id) => id.toString() === postId)) {
      return 'already liked'
    }
    if (user.dislikes.some((id) => id.toString() === postId)) {
      console.log('dislike exist')
      const likedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: 1 },
          $inc: { dislikes: -1 },
        },
        { returnDocument: 'after' }
      )

      const user = await UserModel.findByIdAndUpdate(userId, {
        $push: { likes: postId },
        $pull: { dislikes: postId },
      })

      if (!likedPost || !user) {
        throw ApiError.BadRequest('Unsuccess')
      }

      return likedPost
    } else {
      const likedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: 1 },
        },
        { returnDocument: 'after' }
      )

      await UserModel.findByIdAndUpdate(userId, {
        $push: { likes: postId },
      })

      if (!likedPost) {
        throw ApiError.BadRequest('Unsuccess')
      }

      return likedPost
    }
  }

  async dislikePost(postId, userId) {
    const user = await UserModel.findById(userId).lean()
    if (user.dislikes.some((id) => id.toString() === postId)) {
      return 'already disliked'
    }
    if (user.likes.some((id) => id.toString() === postId)) {
      console.log('like exist')
      const dislikedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { dislikes: 1 },
          $inc: { likes: -1 },
        },
        { returnDocument: 'after' }
      )

      await UserModel.findByIdAndUpdate(userId, {
        $push: { dislikes: postId },
        $pull: { likes: postId },
      })

      if (!dislikedPost) {
        throw ApiError.BadRequest('Unsuccess')
      }

      return dislikedPost
    } else {
      const dislikedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { dislikes: 1 },
        },
        { returnDocument: 'after' }
      )
      await UserModel.findByIdAndUpdate(userId, {
        $push: { dislikes: postId },
      })

      if (!dislikedPost) {
        throw ApiError.BadRequest('Unsuccess')
      }

      return dislikedPost
    }
  }
}

export default new PostService()
