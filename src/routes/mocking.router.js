import { Router } from 'express';
import { generateUsers } from '../utils/faker.js';

const router = Router();


router.get('/', (req, res) => {
    let users = [];
    for (let i = 0; i < 100; i++) {
        users.push(generateUsers())
    }
    res.json({ status: 'success', payload: users })
})


export default router;