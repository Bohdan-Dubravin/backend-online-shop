import { Router } from 'express';
import itemController from '../controllers/itemController.js';
import checkAuth from '../middleware/checkAuth.js';
import checkRole from '../middleware/checkRole.js';

const itemRouter = new Router();

itemRouter.get('/', itemController.getAll);
itemRouter.get('/:id');
itemRouter.post('/create', checkAuth, checkRole, itemController.createItem);
itemRouter.patch(
  '/update/:id',
  checkAuth,
  checkRole,
  itemController.updateItem
);
itemRouter.delete('/delete/:id', checkRole, checkAuth);

export default itemRouter;
