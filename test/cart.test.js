import chai from "chai";
import supertest from "supertest";

const expect = chai.expect
const requester = supertest('http://localhost:8080')


describe('Cart testing', () => {
    before(async () => {
        const login = await requester.post('/users/login').send({
            email: 'msb@hotmail.com',
            password: 'secret'
        })
    })

    it('GET /api/carts should return all carts from the DB.', async() => {
        const response = await requester.get('/api/carts')

        const { status, _body } = response

        expect(_body).to.exist
        expect(status).to.be.equal(200)
    })

    it('GET /api/carts/:cid should return the requested cart from the DB.', async() => {
        const response = await requester.get('/api/carts/6418bef45487eab1b44de2a8')

        const { status, _body } = response

        expect(_body.payload).to.exist.and.not.be.empty
        expect(status).to.be.equal(200)
    })

    it('¨POST /api/carts/:cid/products/:pid should add the selected product to the cart.', async() => {
        const response = await requester.post('/api/carts/6418bef45487eab1b44de2a8/products/63b8331b7dac26c949c2d4bd')

        const { status, _body, ok } = response
        
    })
})