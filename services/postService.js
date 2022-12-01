import CommentPostSchema from '../models/CommentPostSchema.js';
import PostModel from '../models/PostModel.js';
import UserModel from '../models/UserModel.js';
import ApiError from '../utils/apiError.js';

class PostService {
  async getAllPosts() {
    const posts = await PostModel.find()
      .populate('user', 'username avatarUrl likes dislikes')
      .exec();

    return posts;
  }

  async getPost(postId) {
    if (!postId) {
      throw ApiError.BadRequest('Invalid id');
    }
    const foundPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: 'after' }
    )
      .populate('user', '-password')
      .populate('comments');

    return foundPost;
  }

  async createPost(post) {
    const { userId, title, text, imageUrl, tags } = post;

    if (!userId || !title || !text) {
      throw ApiError.BadRequest('Enter all fields');
    }

    const newPost = await PostModel.create({
      title,
      text,
      imageUrl,
      tags,
      user: userId,
    });

    await UserModel.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    });

    return newPost;
  }

  async deletePost(postId) {
    try {
      if (!postId) {
        throw ApiError.BadRequest('Invalid id');
      }

      const post = await PostModel.findByIdAndDelete(postId).lean().exec();

      if (!post) {
        throw ApiError.BadRequest("Post don't exist");
      }

      return post;
    } catch (error) {
      throw ApiError.BadRequest("Can't delete post");
    }
  }

  async updatePost(postId, post) {
    const { title, text, userRole, userId } = post;

    // if (userRole !== 'admin') {
    //   const oldPost = await PostModel.findById(postId).lean().exec()
    //   if (oldPost.user.toString() !== userId) {
    //     throw ApiError.BadRequest('Admin Permission required')
    //   }
    // }

    if (!title || !text) {
      throw ApiError.BadRequest('Required all fields');
    }

    const updatedPost = PostModel.findByIdAndUpdate(postId, {
      $set: { ...post },
    });

    if (!updatedPost) {
      throw ApiError.BadRequest('Post no found');
    }

    return updatedPost;
  }

  async addComment(postId, userId, post) {
    const { rating, text } = post;

    const comment = await CommentPostSchema.create({
      text,
      rating,
      author: userId,
      post: postId,
    });

    if (!comment) {
      throw ApiError.BadRequest('Comment was not created');
    }

    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: { $each: [comment._id], $position: 0 } },
    });

    return comment;
  }

  async likePost(postId, userId) {
    const isLiked = await PostModel.findOne({ usersLiked: [userId] });

    if (isLiked) {
      return 'already liked';
    }

    const isDisliked = await PostModel.findOne({ usersDisliked: [userId] });

    if (isDisliked) {
      const likedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: 1, dislikes: -1 },
          $pull: { usersDisliked: userId },
          $push: { usersLiked: userId },
        },
        { returnDocument: 'after' }
      );

      return likedPost;
    } else {
      const likedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        },
        { returnDocument: 'after' }
      );
      return likedPost;
    }
  }

  async dislikePost(postId, userId) {
    const isDisliked = await PostModel.findOne({ usersDisliked: [userId] });

    if (isDisliked) {
      return 'already disliked';
    }

    const isLiked = await PostModel.findOne({ usersLiked: [userId] });

    if (isLiked) {
      const dislikedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { likes: -1, dislikes: 1 },
          $push: { usersDisliked: userId },
          $pull: { usersLiked: userId },
        },
        { returnDocument: 'after' }
      );

      return dislikedPost;
    } else {
      const dislikedPost = await PostModel.findByIdAndUpdate(
        postId,
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        },
        { returnDocument: 'after' }
      );
      return dislikedPost;
    }
  }
}

export default new PostService();
