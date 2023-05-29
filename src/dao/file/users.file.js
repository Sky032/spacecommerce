import fs from 'fs';
import CustomError from '../../repository/errors/custom.error.js';
import ERRORS from '../../repository/errors/enums.js';
import { generateNotFoundError } from '../../repository/errors/info.js';

export default class Products {

    constructor() {
        this.path = './users.json';
    }

    #getNextID = data => {
        const count = data.length 
        const nextID = (count > 0) ? data[count-1].id + 1 : 1

        return nextID
    }

    getUsers = () => {
        if(fs.existsSync(this.path)) {
            const data = fs.readFileSync(this.path, 'utf-8')
            const users = JSON.parse(data);

            return users
        }
        return [];
    }

    getUser = async(data) => {
        const users = await this.getUsers();
        const user = users.find(u => u.email === data);
        if(user === undefined) {
            CustomError.createError({
                name: `Error in getUser, in users.file.js: `,
                cause: generateNotFoundError(data),
                message: `User not found`,
                code: ERRORS.NOT_FOUND_ERROR
            })

            return false
        }

        return user;
    }

    getById = async (uid) => {
        const users = await this.getUsers();
        const user = users.find(u => u.id === uid);
        if(!user) {
            CustomError.createError({
                name: `Error in getUser, in users.file.js: `,
                cause: generateNotFoundError(data),
                message: `User not found`,
                code: ERRORS.NOT_FOUND_ERROR
            })
        }

        return user
    }

    createUser = async(data) => {
        const users = await this.getUsers();
        const id = await this.#getNextID(users)

        const newUser = {
            id: id, 
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            age: data.age,
            password: data.password,
            social: data.social,
            cart: data.cart,
            documents: data.documents,
        }
        console.log(newUser);

        users.push(newUser)
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2))

        return newUser
    }

    modifyRol = async(uid) => {
        const users = await this.getUsers();
        const user = users.find(u => u.id === uid)

        user.rol = (user.rol === 'user') ? 'premium' : 'users';
        console.log(`USER AFTER MODIFYROL IN FILE: `, user);

        users.push(user)

        await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2));
    }

}