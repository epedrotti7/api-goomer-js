import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../src/config/multer';
import ProductController from './modules/product/product.controller';
import RestaurantController from './modules/restaurant/restaurant.controller';
import PromotionController from './modules/promotion/promotion.controller';

const router = Router();
const upload = multer(multerConfig);

const restaurantController = new RestaurantController();
const productController = new ProductController();
const promotionController = new PromotionController();

router.post('/restaurant', upload.single('avatar'), restaurantController.createRestaurant);
router.get('/restaurant', restaurantController.findAllRestaurants);
router.get('/restaurant/:id', restaurantController.findRestaurantById);
router.put('/restaurant/edit/:id', upload.single('avatar'), restaurantController.updateRestaurantById);
router.delete('/restaurant/delete/:id', restaurantController.deleteRestaurantById);

router.post('/product/:id', upload.single('avatar'), productController.createProduct);
router.get('/product/:id', productController.getProductByRestaurantId);
router.put('/product/edit/:restaurantId/:productId', upload.single('avatar'), productController.updateProductByRestaurantId);
router.delete('/product/delete/:restaurantId/:productId', productController.deleteProductById);

router.post('/promotion/:restaurantId/:productId', promotionController.createPromotion);
router.get('/promotion/:id', promotionController.getPromotionByProductId);
router.put('/promotion/:productId/:promotionId', promotionController.updatePromotionByProductId);
router.delete('/promotion/:productId/:promotionId', promotionController.deletePromotionByProductId);


export default router;