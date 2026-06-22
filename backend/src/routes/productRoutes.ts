import { Router } from 'express'
import { 
  createProduct, 
  updateProduct, 
  getAllProducts, 
  getProductById, 
  deleteProduct 
} from '../controllers/productController'
import { upload } from '../middlewares/uploadMiddleware' // 👈 Certifique-se de criar este middleware conforme o passo anterior

const router = Router()

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.delete('/:id', deleteProduct)

// 🛑 A MÁGICA DO UPLOAD ACONTECE AQUI:
// Adicione o 'upload.single('image')' entre a rota e o controlador
router.post('/', upload.single('image'), createProduct)
router.put('/:id', upload.single('image'), updateProduct)

export default router