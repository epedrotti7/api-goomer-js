import ProductService from "./product.service";

class ProductController {

    productService = new ProductService();

    constructor() { }

    createProduct = async (req, res) => {

        /**O id passado, refere-se ao ID do RESTAURANTE, e não do produto */

        const { id } = req.params;
        const { name, price, category } = req.body;
        const avatar = req.file;

        console.log(category)

        if (avatar) {
            const { filename, path } = avatar;
            await this.productService.createProduct(id, name, price, category, filename, path);
        } else {
            await this.productService.createProduct(id, name, price, category);
        }

        return res.status(200).json({ message: 'Product created successfully!' })
    }

    getProductByRestaurantId = async (req, res) => {
        const { id } = req.params;

        const product = await this.productService.getProductByRestaurantId(id);

        if (product.length <= 0) {
            res.status(400).json({ message: 'Restaurant have no products!' })
        }

        return res.status(200).json(product);
    }

    updateProductByRestaurantId = async (req, res) => {
        const { restaurantId, productId } = req.params;

        const { name, price, category } = req.body;

        const avatar = req.file;

        if (avatar) {
            const { filename, path } = avatar;

            let product = {
                restaurantId,
                productId,
                name,
                price,
                category,
                filename,
                path
            }
            
            console.log(product);

            await this.productService.updateProductByRestaurantId(product);
        } else {
            let product = {
                restaurantId,
                productId,
                name,
                price,
                category
            }
            console.log(product);

            await this.productService.updateProductByRestaurantId(product);
        }

        return res.status(200).json({ message: 'Product has been edited!' });

    }

    deleteProductById = async(req, res) => {

        const {restaurantId, productId} = req.params

        let product = {
            restaurantId,
            productId
        }

        const productResponse = await this.productService.deleteProductById(product);

        if (productResponse.length <= 0) {
            return res.status(400).json({ message: 'Restaurant or Product not found!' });
        }

        return res.status(200).json({ message: 'Product deleted successfully' });
         
    }
}

export default ProductController;