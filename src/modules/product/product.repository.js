
import Connection from '../../database/query';

class ProductRespository {

    connection = new Connection();

    constructor() { }

    async createProduct(product, imageId) {

        if (imageId) {
            /**OBS: product.id refere-se ao restaurant_id, e não ao produto */
            let sql = ` 
        INSERT INTO products (name, price, restaurant_id, category, image_id)
        VALUES ('${product.name}', ${product.price}, '${product.id}', '${product.category}', ${imageId})
    `
            return await this.connection.query(sql);
        } else {
            /**OBS: product.id refere-se ao restaurant_id, e não ao produto */
            let sql = ` 
             INSERT INTO products (name, price, category, restaurant_id)
             VALUES ('${product.name}', ${product.price}, '${product.category}', '${product.id}')
         `
            return await this.connection.query(sql);
        }
    }

    async getProductByRestaurantId(id) {
        let sql = ` 
            SELECT * FROM products WHERE restaurant_id = '${id}'
        `
        return await this.connection.query(sql);
    }

    async updateProductByRestaurantId(product) {

        if (product.filename && product.path) {
            let searchImageId = ` 
                    SELECT * FROM products as p
                    INNER JOIN image as i ON p.image_id = i.id
                    WHERE p.id = ${product.productId}
                `

            let imageId = await this.connection.query(searchImageId).then((result, err) => {
                if (err) console.log(err)
                return result[0]
            })

            const { image_id } = imageId[0];

            let updateImage = `
                
                    UPDATE image as i
                    SET i.name = '${product.filename}', i.path = '${product.path}'
                    WHERE i.id = ${image_id}
                `

            await this.connection.query(updateImage);

            let searchRestaurant = ` 
            SELECT * FROM restaurant WHERE id = '${product.restaurantId}';
        `

            let restaurantIdQuery = await this.connection.query(searchRestaurant).then((result, err) => {
                if (err) console.log(err)
                return result[0];
            });

            const { id } = restaurantIdQuery[0];

            let sql = `
            UPDATE products as p
            SET p.name = '${product.name}', p.price = '${product.price}', p.category = '${product.category}'
            WHERE p.id = ${product.productId} AND p.restaurant_id = '${id}'
        `

            return await this.connection.query(sql);

        } else {
            let searchRestaurant = ` 
            SELECT * FROM restaurant WHERE id = '${product.restaurantId}';
        `

            let restaurantIdQuery = await this.connection.query(searchRestaurant).then((result, err) => {
                if (err) console.log(err)
                return result[0];
            });

            const { id } = restaurantIdQuery[0];

            let sql = `
            UPDATE products as p
            SET p.name = '${product.name}', p.price = '${product.price}', p.category = '${product.category}'
            WHERE p.id = ${product.productId} AND p.restaurant_id = '${id}'
        `

            return await this.connection.query(sql);
        }

    }

    async deleteProductById(product) {

        const verifyRestaurantExists = `
        SELECT * FROM restaurant WHERE id = '${product.restaurantId}'
        `

        const verifyRestaurantExistsById = await this.connection.query(verifyRestaurantExists);

        const restaurantinfo = JSON.parse(JSON.stringify(verifyRestaurantExistsById[0]));

        if (restaurantinfo.length <= 0) {
            return [];

        } else if (restaurantinfo.length >= 0) {
            const verifyProductExists = `
                SELECT * FROM products as p 
                INNER JOIN restaurant as r ON p.restaurant_id = r.id
                WHERE p.id = ${product.productId}
            `

            const verifyProductExistsById = await this.connection.query(verifyProductExists);

            const productInfo = JSON.parse(JSON.stringify(verifyProductExistsById[0]));

            if (productInfo.length <= 0) {
                return [];
            } else {
                let sql = ` 
                    DELETE FROM products as p
                    WHERE p.id = ${product.productId} AND p.restaurant_id = '${product.restaurantId}'
                `
                return await this.connection.query(sql);
            }

        }
    }
}

export default ProductRespository;