import chai from "chai";
import supertest from "supertest";



const expect = chai.expect;
const requester = supertest('http://localhost:8080');


describe('Products testing', () => {

    it('El endpoint /api/products/:pid debe retornar el producto solicitado', async () => {
        
        const response = await requester.get('/api/products/63b8331b7dac26c949c2d4bd')
        const {status, _body } = response

        expect(_body).to.exist
        expect(status).to.be.equal(200)
    })

    it('El endpoint /api/products, METHOD: POST, debe retornar error si no hay usuario logueado al crear nuevo producto', async() => {

        const newProd = {
            title: 'Leia Organa',
            description: 'Rebel',
            thumbnail: '',
            category: 'sexy',
            price: 200,
            code: 'Leia1',
            status: true,
            stock: 10,
        }

        const response = await requester.post('/api/products').send(newProd)

        const {status} = response

        expect(status).to.be.equal(401)
    })
})