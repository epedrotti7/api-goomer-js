
import Connection from '../../database/query';

class RestaurantRepository {

    connection = new Connection();

    constructor() { }

    async createRestaurant(restaurant) {

        const sql = ` 
            INSERT INTO restaurant (id, name, address)
            VALUES ('${restaurant.id}', '${restaurant.name}', '${restaurant.address}')
        `

        const createRestaurant = await this.connection.query(sql);

        this.createOperationHours(restaurant);

        if (restaurant.filename && restaurant.path) {
            return this.createAvatar(restaurant);
        }

        return createRestaurant;
    }

    async createOperationHours(restaurant) {

        const operation_hours = restaurant.operation_hours;

        const sql = `
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
            '${operation_hours.open_hour}', 
            '${operation_hours.closed_hour}',
            '${restaurant.id}',
            ${operation_hours.week_day_0},
            ${operation_hours.week_day_1},
            ${operation_hours.week_day_2},
            ${operation_hours.week_day_3},
            ${operation_hours.week_day_4},
            ${operation_hours.week_day_5},
            ${operation_hours.week_day_6}
            );
        `
        return await this.connection.query(sql);
    }

    async createAvatar(restaurant) {

        const sql = ` 
            INSERT INTO image (name, restaurant_id, path)
            VALUES (
                '${restaurant.filename}',
                '${restaurant.id}',
                '${restaurant.path}'
            )
        `
        return await this.connection.query(sql).then((result, err) => {
            if (err) console.log(err)
            return result[0].insertId;
        });
    }

    async findAllRestaurants() {

        /**Fiquei 3 horas tentando buscar os restaurantes com e sem avatar, quando na verdade
         * era só adicionar um LEFT OUTER JOIN, para buscar o que tinha relação com a tabela image e com o que não tinha
         */
        const sql = `
            SELECT r.*, oh.*, i.path FROM restaurant as r 
            INNER JOIN operation_hours as oh ON oh.restaurant_id = r.id
            LEFT OUTER JOIN image as i ON r.id = i.restaurant_id
        `
        return await this.connection.query(sql);
    }

    async findRestaurantById(id) {

        const sqlImage = `
            SELECT i.path FROM image as i WHERE i.restaurant_id = '${id}'
        `
        const checkImageExists = await this.connection.query(sqlImage).then((result, err) => {
            if (err) console.log(err)
            return result[0];
        });

        if (checkImageExists.length <= 0) {
            let sql = `
            SELECT r.name, r.address, r.id, oh.open_hour, oh.closed_hour, 
            oh.week_day_0,
            oh.week_day_1,
            oh.week_day_2,
            oh.week_day_3,
            oh.week_day_4,
            oh.week_day_5,
            oh.week_day_6
            FROM restaurant as r
            INNER JOIN operation_hours as oh ON r.id = oh.restaurant_id
            WHERE r.id = '${id}';
            `
            return await this.connection.query(sql);
        } else {
            let sql = `
                SELECT r.name, r.address, r.id, oh.open_hour, oh.closed_hour, 
                oh.week_day_0,
                oh.week_day_1,
                oh.week_day_2,
                oh.week_day_3,
                oh.week_day_4,
                oh.week_day_5,
                oh.week_day_6,
                i.path
                FROM restaurant as r
                INNER JOIN operation_hours as oh ON r.id = oh.restaurant_id
                INNER JOIN image as i ON r.id = i.restaurant_id
                WHERE r.id = '${id}';
                `
            return await this.connection.query(sql);
        }
    }

    async updateRestaurantById(restaurant) {

        const verifyRestaurantExists = `
            SELECT * FROM restaurant WHERE id = '${restaurant.id}'
        `

        const verifyRestaurantExistsById = await this.connection.query(verifyRestaurantExists);

        const restaurantinfo = JSON.parse(JSON.stringify(verifyRestaurantExistsById[0]));

        if (restaurantinfo.length <= 0) {
            return [];

        } else {
            if (restaurant.filename && restaurant.path) {
                let sql = `
                UPDATE restaurant as r,operation_hours as oh, image as i
                SET r.name = '${restaurant.name}', r.address = '${restaurant.address}', 
                oh.open_hour = '${restaurant.operation_hours_object.open_hour}',
                oh.closed_hour = '${restaurant.operation_hours_object.closed_hour}',
                oh.week_day_0 = ${restaurant.operation_hours_object.week_day_0},
                oh.week_day_1 = ${restaurant.operation_hours_object.week_day_1},
                oh.week_day_2 = ${restaurant.operation_hours_object.week_day_2},
                oh.week_day_3 = ${restaurant.operation_hours_object.week_day_3},
                oh.week_day_4 = ${restaurant.operation_hours_object.week_day_4},
                oh.week_day_5 = ${restaurant.operation_hours_object.week_day_5},
                oh.week_day_6 = ${restaurant.operation_hours_object.week_day_6},
                i.name = '${restaurant.filename}',
                i.path = '${restaurant.path}'
                WHERE r.id = '${restaurant.id}' AND oh.restaurant_id = '${restaurant.id}' AND i.restaurant_id = '${restaurant.id}'
                `
                return await this.connection.query(sql);
            } else {

                const sqlImage = ` 
                SELECT i.id FROM restaurant as r 
                INNER JOIN image as i ON r.id = i.restaurant_id
                WHERE r.id = '${restaurant.id}'
                `
                const queryImage = await this.connection.query(sqlImage).then((result, err) => {
                    if (err) console.log(err)
                    return result[0];
                });

                const { id } = JSON.parse(JSON.stringify(queryImage[0]));

                const deleteImage = ` 
                DELETE FROM image WHERE id = ${id}
                `
                await this.connection.query(deleteImage);

                const sql = `
                UPDATE restaurant as r,operation_hours as oh
                SET r.name = '${restaurant.name}', r.address = '${restaurant.address}', 
                oh.open_hour = '${restaurant.operation_hours_object.open_hour}',
                oh.closed_hour = '${restaurant.operation_hours_object.closed_hour}',
                oh.week_day_0 = ${restaurant.operation_hours_object.week_day_0},
                oh.week_day_1 = ${restaurant.operation_hours_object.week_day_1},
                oh.week_day_2 = ${restaurant.operation_hours_object.week_day_2},
                oh.week_day_3 = ${restaurant.operation_hours_object.week_day_3},
                oh.week_day_4 = ${restaurant.operation_hours_object.week_day_4},
                oh.week_day_5 = ${restaurant.operation_hours_object.week_day_5},
                oh.week_day_6 = ${restaurant.operation_hours_object.week_day_6}
                WHERE r.id = '${restaurant.id}' AND oh.restaurant_id = '${restaurant.id}'
                `
                return await this.connection.query(sql);
            }
        }
    }

    async deleteRestaurantById(id) {

        const verifyRestaurantExists = `
        SELECT * FROM restaurant WHERE id = '${id}'
        `

        const verifyRestaurantExistsById = await this.connection.query(verifyRestaurantExists);

        const restaurantinfo = JSON.parse(JSON.stringify(verifyRestaurantExistsById[0]));

        if (restaurantinfo.length <= 0) {
            return [];

        } else {
            let sql = ` 
                DELETE FROM restaurant
                WHERE restaurant.id = '${id}';
            `
            return await this.connection.query(sql);
        }
    }
}


export default RestaurantRepository;