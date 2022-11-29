import { Router } from 'express'
import itemController from '../controllers/itemController.js'
import checkAuth from '../middleware/checkAuth.js'
import checkRole from '../middleware/checkRole.js'

const itemRouter = new Router()

itemRouter.get('/', itemController.getAll)
itemRouter.get('/:id', itemController.getOne)
itemRouter.post('/create', checkAuth, checkRole, itemController.createItem)
itemRouter.patch('/update/:id', checkAuth, checkRole, itemController.updateItem)
itemRouter.delete('/delete/:id', checkRole, checkAuth)
itemRouter.get('/comments/:itemId', itemController.getComments)
itemRouter.post('/comments/:itemId', checkAuth, itemController.createComment)

export default itemRouter
