import itemService from '../services/itemService.js'

class ItemController {
  async getAll(req, res, next) {
    try {
      const items = await itemService.getAllItems()

      res.status(200).json(items)
    } catch (error) {
      next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const id = req.params.id

      const foundItem = itemService.getItem(id)

      res.status(200).json(foundItem)
    } catch (error) {
      next(error)
    }
  }

  async createItem(req, res, next) {
    try {
      const newItem = await itemService.createItem(req.body)

      res.status(200).json(newItem)
    } catch (error) {
      next(error)
    }
  }

  async updateItem(req, res, next) {
    try {
      const id = req.params.id

      const newItem = await itemService.updateItem(req.body, id)

      res.status(200).json(newItem)
    } catch (error) {
      next(error)
    }
  }

  async deleteItem(req, res, next) {
    try {
      const id = req.params.id
      const deletedItem = await itemService.deleteItem(req.body, id)

      return res.status(200).json(deletedItem)
    } catch (error) {
      next(error)
    }
  }

  async getComments(req, res, next) {
    try {
      const id = req.params.itemId
      const itemComments = await itemService.getComments(id)

      return res.status(200).json(itemComments)
    } catch (error) {
      next(error)
    }
  }

  async createComment(req, res, next) {
    try {
      const id = req.params.itemId
      const newComment = await itemService.createComment(req.user, req.body, id)

      return res.status(200).json(newComment)
    } catch (error) {
      next(error)
    }
  }
}

export default new ItemController()
