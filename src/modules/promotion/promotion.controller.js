
import PromotionService from './promotion.service';

export default class PromotionController {

    promotionService = new PromotionService();

    constructor() { }

    createPromotion = async (req, res) => {

        const { restaurantId, productId } = req.params;

        const { description, price, operation_hours } = req.body;

        await this.promotionService.createPromotion(restaurantId, productId, description, price, operation_hours);

        return res.status(200).json({ message: 'Promotion has been created!' });
    }

    getPromotionByProductId = async (req, res) => {
        const { id } = req.params;
        let promotion = await this.promotionService.getPromotionByProductId(id);

        if (promotion.length <= 0) {
            return res.status(400).json({ message: 'Promotion not found!' });
        }

        return res.status(200).json(promotion);
    }

    deletePromotionByProductId = async (req, res) => {
        const {productId, promotionId} = req.params;

        const promotionResponse = await this.promotionService.deletePromotionByProductId(productId, promotionId);

        if (promotionResponse.length <= 0) {
            return res.status(400).json({ message: 'Promotion not found!' });
        }

        return res.status(200).json({ message: 'Promotion deleted successfully' });
    }

    updatePromotionByProductId = async (req, res) => {
        const {productId, promotionId} = req.params;

        const { description, price, operation_hours } = req.body;
        
        let promotionResponse = await this.promotionService.updatePromotionByProductId(productId, promotionId, description, price, operation_hours);

        if (promotionResponse.length <= 0) {
            return res.status(400).json({ message: 'Promotion not found!' });
        }
       
        return res.status(200).json({ message: 'Promotion edited successfully' });
    }
}