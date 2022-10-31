import PostModel from "../models/PostModel.js";
import ApiError from "../utils/apiError.js";

class PostService {
  async getAllPosts() {
    const posts = await PostModel.find().populate("user").exec();

    return posts;
  }

  async getPost(postId) {
    if (!postId) {
      throw ApiError.BadRequest("Invalid id");
    }
    PostModel.findOneAndUpdate(
      { _id: postId },
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: "after", new: true },
      (err, doc) => {
        if (err) {
          throw ApiError.BadRequest("Can't return post");
        }
        if (!doc) {
          throw ApiError.BadRequest("Post not found");
        }
      }
    );
  }

  async createPost(post) {
    const { userId, title, text, imageUrl, tags } = post;

    if (!userId || !title || !text) {
      throw ApiError.BadRequest("Enter all fields");
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
}

export default new PostService();
