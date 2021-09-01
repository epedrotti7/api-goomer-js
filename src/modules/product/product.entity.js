
class ProductEntity {

    /**o ID recebido pelo parametro, refere-se ao ID DO RESTAURANTE e nao do produto */
    constructor({ name, price, id, category, filename, path }) {
        this.name = name;
        this.price = price;
        this.category = category;
        this.id = id;
        this.filename = filename;
        this.path = path;
    }
}

export default ProductEntity;