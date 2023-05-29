import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    req.logger.fatal('FATAL ERROR')
    req.logger.error('error on DB')
    req.logger.warning('Dont worry, it\'s just warning')
    req.logger.info('Se llamo a la pagian principal')
    req.logger.http(`Method ${req.method} en el endpoint: ${req.url}`)
    req.logger.debug('1 + 1 === 2 ???')

    res.send({message: 'Logger testing!!'})
})

export default router