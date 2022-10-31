import PostModel from '../models/PostModel.js';
import ApiError from '../utils/apiError.js';

class PostService {
  async createPost(post) {
    const { userId, title, text, imageUrl, tags } = post;

    if (!userId || !title || !text) {
      throw ApiError.BadRequest('Required all fields');
    }

    const post = PostModel.create({
      title,
      text,
      imageUrl,
      tags,
      user: userId,
    });

    return post;
  }
}

export default new PostService();
