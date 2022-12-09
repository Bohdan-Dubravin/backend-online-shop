import CommentPostSchema from '../models/CommentPostSchema.js'
import PostModel from '../models/PostModel.js'
import UserModel from '../models/UserModel.js'
import ApiError from '../utils/apiError.js'

class PostService {
  async getAllPosts(tag) {
    if (tag) {
      const posts = await PostModel.find({ tags: tag })
        .select('-text')
        .populate('user', 'username avatarUrl')
        .populate('comments', 'rating')
      return posts
    }

    const posts = await PostModel.find()
      .select('-text')
      .populate('user', 'username avatarUrl')
      .populate('comments', 'rating')

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
    if (!postId) {
      throw ApiError.BadRequest('Invalid id')
    }

    const post = await PostModel.findByIdAndDelete(postId)

    if (!post) {
      throw ApiError.NotFound("Don't find post id")
    }

    return 'Post'
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
    const post = await PostModel.findById(postId).lean()

    const isLiked = post.usersLiked.some((id) => id.toString() === userId)

    if (isLiked) {
      return 'already disliked'
    }

    const isDisliked = post.usersDisliked.some((id) => id.toString() === userId)

    if (isDisliked) {
      const likedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: 1, dislikes: -1 },
          $pull: { usersDisliked: userId },
          $push: { usersLiked: userId },
        },
        { returnDocument: 'after' }
      )

      return likedPost
    } else {
      const likedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        },
        { returnDocument: 'after' }
      )
      return likedPost
    }
  }

  async dislikePost(postId, userId) {
    const post = await PostModel.findById(postId).lean()

    const isDisliked = post.usersDisliked.some((id) => id.toString() === userId)

    if (isDisliked) {
      return 'already disliked'
    }

    const isLiked = post.usersLiked.some((id) => id.toString() === userId)

    if (isLiked) {
      const dislikedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: -1, dislikes: 1 },
          $push: { usersDisliked: userId },
          $pull: { usersLiked: userId },
        },
        { returnDocument: 'after' }
      )

      return dislikedPost
    } else {
      const dislikedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        },
        { returnDocument: 'after' }
      )
      return dislikedPost
    }
  }

  async getTags() {
    const tags = await PostModel.find().select('tags -_id').lean()
    const arrTags = []
    for (let i = 0; i < tags.length; i++) {
      arrTags.push(...tags[i].tags)
    }

    const freq = arrTags.reduce((r, e) => {
      if (!r[e]) r[e] = 1
      else r[e]++
      return r
    }, {})

    const sorted = [...arrTags].sort((a, b) => {
      return freq[b] - freq[a] || a - b
    })

    const uniqueTags = sorted.filter((c, index) => {
      return sorted.indexOf(c) === index
    })
    return uniqueTags
  }
}

export default new PostService()
