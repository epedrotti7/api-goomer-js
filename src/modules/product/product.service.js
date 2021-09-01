import RestaurantRepository from "../restaurant/restaurant.repository";
import ProductEntity from "./product.entity";
import ProductRespository from "./product.repository";

class ProductService {

    productRepository = new ProductRespository();
    restaurantRepository = new RestaurantRepository();


    constructor() { }

    async createProduct(id, name, price, category, filename, path) {

        if (filename && path) {

            const imageInfo = {
                id,
                filename,
                path
            }

            /**Cria o avatar do produto, e retorna o ID, para criarmos o produto com o avatar criado */
            const imageId = await this.restaurantRepository.createAvatar(imageInfo)

            const product = new ProductEntity({
                id,
                name,
                price,
                category,
                filename,
                path
            });

            return await this.productRepository.createProduct(product, imageId);
        } else {
            const product = new ProductEntity({
                id,
                name,
                price,
                category
            });

            return await this.productRepository.createProduct(product);
        }

    }

    async getProductByRestaurantId(id) {

        const product = await this.productRepository.getProductByRestaurantId(id);

        return JSON.parse(JSON.stringify(product[0]));
    }

    async updateProductByRestaurantId(product){

        return this.productRepository.updateProductByRestaurantId(product);

    }

    async deleteProductById(product){
        return await this.productRepository.deleteProductById(product);
    }
}

export default ProductService;