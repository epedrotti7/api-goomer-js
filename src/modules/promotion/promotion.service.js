import PromotionRepository from "./promotion.repository";
import PromotionEntity from './promotion.entity';

export default class PromotionService{
    
    promotionRepository = new PromotionRepository();
    
    constructor(){}

    async createPromotion(restaurantId, productId, description, price, operation_hours){

        const restaurant_id = restaurantId;
        const product_id = productId;

        const promotionObj = new PromotionEntity({
            description: description,
            price: price,
            operation_hours: operation_hours
        })

       return await this.promotionRepository.createPromotion(promotionObj, restaurant_id, product_id);
    }

    async getPromotionByProductId(productId){
        return await this.promotionRepository.getPromotionByProductId(productId);
    }

    async deletePromotionByProductId(productId, promotionId){
        return await this.promotionRepository.deletePromotionByProductId(productId, promotionId);
    }

    async updatePromotionByProductId(productId, promotionId, description, price, operation_hours){
        console.log(operation_hours)
        return await this.promotionRepository.updatePromotionByProductId(productId, promotionId, description, price, operation_hours);
    }
}