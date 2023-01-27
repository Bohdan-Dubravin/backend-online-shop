import { Router } from 'express'
import postController from '../controllers/postController.js'
import checkAuth from '../middleware/checkAuth.js'
import checkRole from '../middleware/checkRole.js'
import { postValidation } from '../validations/Validations.js'

const postRouter = new Router()

postRouter.get('/', postController.getAllPosts)
postRouter.get('/tags', postController.getTags)
postRouter.get('/:id', postController.getPost)
postRouter.post(
  '/create',
  checkAuth,
  checkRole,
  postValidation,
  postController.createPost
)
postRouter.patch('/update/:id', checkAuth, postController.updatePost)
postRouter.delete('/delete/:id', checkAuth, postController.deletePost)
postRouter.post('/create/comment/:id', checkAuth, postController.addComment)
postRouter.post('/like/:id', checkAuth, postController.likePost)
postRouter.post('/dislike/:id', checkAuth, postController.dislikePost)

export default postRouter
