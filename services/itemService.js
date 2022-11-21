import ItemModel from '../models/ItemModel.js';
import CommentModel from '../models/CommentItemModel.js';
import ApiError from '../utils/apiError.js';
import UserModel from '../models/UserModel.js';

class ItemService {
  async getAllItems() {
    const items = await ItemModel.find().lean();
    if (!items) {
      throw ApiError.NotFound();
    }

    return items;
  }

  async getItem(postId) {
    if (!postId) {
      throw ApiError.BadRequest('Invalid id');
    }
    const item = await ItemModel.findById(postId).lean();

    if (!item) {
      throw ApiError.NotFound();
    }

    return item;
  }

  async createItem(item) {
    const { title, price, userId } = item;
    const postContent = { ...item, user: userId };

    if (!title || !price) {
      throw ApiError.BadRequest('Enter all fields');
    }

    const newPost = await ItemModel.create(postContent);

    return newPost;
  }

  async updateItem(item, id) {
    const { title, price, userRole, userId } = item;

    if (userRole !== 'admin') {
      const itm = await ItemModel.findById(id).lean();
      if (itm.user.toString() !== userId) {
        throw ApiError.BadRequest('Admin Permission required');
      }
    }

    if (!title || !price) {
      throw ApiError.BadRequest('Enter all fields');
    }

    const updatedDoc = await ItemModel.findOneAndUpdate({ _id: id }, item, {
      returnDocument: 'after',
    });

    if (!updatedDoc) {
      throw ApiError.NotFound('Item not exist');
    }

    return updatedDoc;
  }

  async deleteItem(item, id) {
    const { userRole, userId } = item;

    if (userRole !== 'admin') {
      const itm = await ItemModel.findById(id).lean();
      if (itm.user.toString() !== userId) {
        throw ApiError.BadRequest('Admin Permission required');
      }
    }

    const post = await ItemModel.findByIdAndDelete(id).lean();

    if (!post) {
      throw ApiError.BadRequest("Post don't exist");
    }

    return post;
  }

  async getComments(postId) {
    const postComments = await ItemModel.find({ _id: postId })
      .populate('comments')
      .populate({
        path: 'comments',
        populate: { path: 'author', model: 'User', select: 'username' },
      });

    return postComments;
  }

  async createComment(user, comment, postId) {
    const newComment = await CommentModel.create({
      title: comment.title,
      rating: comment.rating,
      author: user.id,
      item: postId,
    });

    await ItemModel.updateOne(
      { _id: postId },
      { $push: { comments: newComment._id } }
    );
    return newComment;
  }
}
export default new ItemService();
