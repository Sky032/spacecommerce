export default class ProductDTO {
    
    constructor(product) {
        this.title = product.title || "",
        this.description = product.description || "",
        this.thumbnail = product.thumbnail || "",
        this.category = product.category || "",
        this.price = product.price || 0,
        this.code = product.code || "",
        this.status = product.status || true,
        this.stock = product.stock || 0,
        this.owner = product.owner
    }
}