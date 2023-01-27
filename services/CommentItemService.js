import CommentModel from '../models/CommentItemModel';
import ApiError from '../utils/apiError.js';

class CommentItemService {
  async getAllItems() {
    const items = await CommentModel.find().lean();
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
}
export default new CommentItemService();
