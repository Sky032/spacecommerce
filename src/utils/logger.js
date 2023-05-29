import winston from 'winston';
import config from '../config/config.js';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'grey',
        warning: 'yellow',
        info: 'blue',
        http: 'white',
        debug: 'green'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level: 'warning', 
            format: winston.format.simple() 
        })
    ]
})

const productionLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level: 'warning', 
            format: winston.format.simple() 
        })
    ]
})

export const addLogger = (req, res, next) => {
    const entorno = config.ENT
    if (entorno === 'DESARROLLO') {
        req.logger = devLogger
        const date = new Date();
        const currentDate = date.toLocaleString()
        req.logger.info(`Method ${req.method} en endpoint ${req.url} - ${currentDate}`)
    }

    if (entorno === 'PRODUCCION') {
        req.logger = productionLogger
        const date = new Date();
        const currentDate = date.toLocaleString()
        req.logger.info(`Method ${req.method} en endpoint ${req.url} - ${currentDate}`)
    }

    next()
}