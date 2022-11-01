import PostModel from '../models/PostModel.js';
import ApiError from '../utils/apiError.js';

class PostService {
  async getAllPosts() {
    const posts = await PostModel.find().populate('user').exec();

    return posts;
  }

  async getPost(postId) {
    try {
      if (!postId) {
        throw ApiError.BadRequest('Invalid id');
      }
      return await PostModel.findOneAndUpdate(
        { _id: postId },
        {
          $inc: { viewsCount: 1 },
        },
        { returnDocument: 'after' }
      );
    } catch (error) {
      throw ApiError.BadRequest('Note not found');
    }
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
    try {
      if (!postId || !post) {
        throw ApiError.BadRequest('Required all fields');
      }

      const oldPost = await PostModel.findById(postId).lean().exec();

      if (!oldPost) {
        throw ApiError.BadRequest('Post no found');
      }

      const updatedPost = await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          ...oldPost,
          ...post,
        }
      );

      return updatedPost;
    } catch (error) {
      console.log(error);
      throw ApiError.BadRequest("Can't update post");
    }
  }
}

export default new PostService();
