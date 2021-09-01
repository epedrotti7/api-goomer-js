
import Connection from '../../database/query';


export default class PromotionRepository {

    connection = new Connection();

    constructor() { }

    async createPromotion(promotion, restaurant_id, product_id) {

        const sqlOperationHours = `
        INSERT INTO operation_hours (
            open_hour, 
            closed_hour, 
            restaurant_id,
            week_day_0,
            week_day_1,
            week_day_2,
            week_day_3,
            week_day_4,
            week_day_5,
            week_day_6    
        )
        VALUES (
            '${promotion.operation_hours.open_hour}', 
            '${promotion.operation_hours.closed_hour}',
            '${restaurant_id}',
            ${promotion.operation_hours.week_day_0},
            ${promotion.operation_hours.week_day_1},
            ${promotion.operation_hours.week_day_2},
            ${promotion.operation_hours.week_day_3},
            ${promotion.operation_hours.week_day_4},
            ${promotion.operation_hours.week_day_5},
            ${promotion.operation_hours.week_day_6}
            );
        `

        const operationHoursPromotionId = await this.connection.query(sqlOperationHours).then((result, err) => {
            if (err) console.log(err)
            return result[0].insertId;
        });

        const sqlPromotion = ` 
            INSERT INTO promotion (description, price, operation_hours_id, product_id)
            VALUES ('${promotion.description}', ${promotion.price}, ${operationHoursPromotionId}, ${product_id} )
        `
        return await this.connection.query(sqlPromotion);
    }

    async getPromotionByProductId(productId) {
        let sql = ` 
                
                SELECT p.id as promotion_id, p.description as description, p.price  as price, 
                p.product_id as product_id, oh.open_hour  as open_hour, oh.closed_hour as closed_hour, 
                oh.restaurant_id as restaurant_id,
                oh.week_day_0 as domingo, 
                oh.week_day_1 as segunda, 
                oh.week_day_2 as terca, 
                oh.week_day_3 as quarta, 
                oh.week_day_4 as quinta, 
                oh.week_day_5 as sexta, 
                oh.week_day_6  as sabado
                FROM promotion as p
                INNER JOIN operation_hours as oh
                ON p.operation_hours_id = oh.id
                WHERE p.product_id = ${productId};
        `

        return await this.connection.query(sql).then((result, err) => {
            if (err) console.log(err)
            return result[0];
        });

    }

    async deletePromotionByProductId(productId, promotionId) {

        const verifyPromotionExists = `
        SELECT * FROM promotion WHERE id = '${promotionId}'
        `
        const verifyPromotionExistsById = await this.connection.query(verifyPromotionExists);

        const promotionInfo = JSON.parse(JSON.stringify(verifyPromotionExistsById[0]));

        if (promotionInfo.length <= 0) {
            return [];

        } else {
            let sql = ` 
            DELETE FROM promotion 
            WHERE id = ${promotionId} AND product_id = ${productId}
        `
            return await this.connection.query(sql);
        }
    }

    async updatePromotionByProductId(productId, promotionId, description, price, operation_hours) {


        console.log(operation_hours)

        const verifyPromotionExists = `
        SELECT * FROM promotion WHERE id = '${promotionId}'
        `
        const verifyPromotionExistsById = await this.connection.query(verifyPromotionExists);

        const promotionInfo = JSON.parse(JSON.stringify(verifyPromotionExistsById[0]));

        if (promotionInfo.length <= 0) {
            return [];

        } else {

            let sqlOperationHours = ` 
            SELECT * FROM promotion WHERE id = '${promotionId}'
            
            `
            const OperationHoursId = await this.connection.query(sqlOperationHours).then((result, err) => {
                if (err) console.log(err)
                return result[0];
            });

            let { operation_hours_id } = OperationHoursId[0]

            let updateOperationHours = `
                UPDATE operation_hours as oh
                SET oh.open_hour = '${operation_hours.open_hour}',
                oh.closed_hour = '${operation_hours.closed_hour}',
                oh.week_day_0 = ${operation_hours.week_day_0},
                oh.week_day_1 = ${operation_hours.week_day_1},
                oh.week_day_2 = ${operation_hours.week_day_2},
                oh.week_day_3 = ${operation_hours.week_day_3},
                oh.week_day_4 = ${operation_hours.week_day_4},
                oh.week_day_5 = ${operation_hours.week_day_5},
                oh.week_day_6 = ${operation_hours.week_day_6}
                WHERE oh.id = ${operation_hours_id}
            `

            await this.connection.query(updateOperationHours)

            let updatePromotion = `
                UPDATE promotion as p
                SET p.description = '${description}',
                p.price = ${price}
                WHERE p.id = ${promotionId} AND p.product_id = ${productId}
               `

               console.log(updatePromotion)

            return await this.connection.query(updatePromotion);
        }
    }
}