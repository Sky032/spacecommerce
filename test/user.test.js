import chai from 'chai';
import supertest from 'supertest';
import config from '../src/config/config.js';
import { generateOneUser } from '../src/utils/faker.js';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');


describe('User register and login', () => {

    // describe('POST /resgister', () => {
    //     it("Should return 401 if the user already exists.", async () => {

    //         const realUser = {
    //             first_name: 'Martin',
    //             last_name: 'Buiz',
    //             email: 'msbuiz@hotmail.com',
    //             password: 'contraseña'
    //         }
    //         const {status} = await requester.post('/api/users/register').send(realUser);

    //         expect(status).to.be.equal(401)
    //     });

        // it('Should resgister a new user.', async () => {
        //     const fakeUser = generateOneUser()

        //     const {response} = await requester.post("/api/users/register").send(fakeUser);

        //     expect(response).to.exist.and.to.be.equal(200);
        // })

    // })

    describe('POST /login', () => {
        it('POST /login',  async () => {
            const realUser = {
                email: 'msbuiz@hotmail.com',
                password: 'contraseña'
            }

            const response = await requester.post('/api/users/login').send(realUser)

            const { status, ok } = response

            expect(status).to.exist.and.to.be.equal(200)
            expect(ok).to.exist.and.to.be.eql(true)
        })
    })

    describe('GET /api/users', () => {
        let cookie;

        const mockUser = generateOneUser()

        const realUser = {
            email: 'msbuiz@hotmail.com',
            password: 'contraseña'
        }

        beforeEach(async() => {
            const login = await requester.post('/api/users/login').send(realUser)
        })

        it(`GET /api/users/current`, async () => {
            const response = await requester.get('/api/users/current')

            const { status, _body } = response

            expect(status).to.be.eql(200);
        })

        // it('Debe registrar un usario', async () => {
        //     const { _body } = await requester.post('/api/users/register').send(mockUser)

        //     expect(_body.payload).to.be.ok
        // })

        it('Debe loguear un user y DEVOLVER UNA COOKIE', async () => {
            const result = await requester.post('/api/users/login').send(realUser)

            //COOKIE_NAME=COOKIE_VALUE
            const cookieResult = result.headers['set-cookie'][0]

            expect(cookieResult).to.be.ok 
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }


            expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
            expect(cookie.value).to.be.ok

        })

        it('enviar cookie para ver el contenido del usuario', async () => {
            const {status, _body} = await requester.get('/api/users/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

            
            expect(_body.payload.email).to.be.eql(realUser.email)
        })
    })


})