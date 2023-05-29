import ProductDTO from '../dao/DTO/products.dto.js';

export default class ProductRepository {
    
    constructor(dao) {
        this.dao = dao;
    }

    get = async(options, query) => {
        return await this.dao.get(options, query)
    }

    find = async(data) => {
        return await this.dao.find(data)
    }

    add = async(data) => {
        const product = new ProductDTO(data)
        const result = this.dao.add(product)

        return result
    }

    update = async(id, data) => {
        return this.dao.update(id, data)
    }

    deleteOne = async(data) => {
        return this.dao.deleteOne(data)
    }
    
    updateStock = async(pid, quantity) => {
        return this.dao.updateStock(pid, quantity)
    }

}