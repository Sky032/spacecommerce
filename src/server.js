import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import config from './config/config.js';
import { __dirname } from './dirname.js';
import MongoStore from 'connect-mongo';
import socket from './utils/socket.io.js';
import initializePassport from './config/passport.config.js';
import errorHandler from './middleware/errors.middleware.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { passportCall } from './utils/utils.js';
import { Server } from 'socket.io';
import { addLogger } from './utils/logger.js';
import cors from 'cors';
import swaggerUiExpress from "swagger-ui-express";
import initSwagger from './utils/swagger.js';
// Rutas
import cartRouter from './routes/carts.router.js';
import productRouter from './routes/products.router.js';
import userRouter from './routes/users.router.js';
import apiUsersRouter from './routes/api.users.router.js';
import messageRouter from './routes/messages.router.js';
import viewsRouter from './routes/views.router.js';
import mockingRouter from './routes/mocking.router.js';
import loggerRouter from './routes/logger.router.js';


const app = express();

const httpServer = app.listen(config.PORT, console.log(`Server up & running on port ${config.PORT}`));


app.use(cors())
app.use(addLogger)
app.use(errorHandler)
app.use('/apiDocs', swaggerUiExpress.serve, swaggerUiExpress.setup(initSwagger()))
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser(config.COOKIE_SECRET))

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        dbName: config.DB_NAME,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 10000
    }),
    secret: 'S@nsa2018',
    resave: true,
    saveUninitialized: true
}));

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Socket.io logic.
const io = new Server(httpServer) // Se crea el servidor Socket
socket(io)

app.use('/api/logger', loggerRouter)
app.use('/api/carts', passportCall('jwt'), cartRouter);
app.use('/api/products', passportCall('jwt'), productRouter);
app.use('/api/users', passportCall('jwt'), apiUsersRouter);
app.use('/api/mockingproducts', mockingRouter);
app.use('/', viewsRouter)
app.use('/users', passportCall('jwt'), userRouter);
app.use('/message', messageRouter);