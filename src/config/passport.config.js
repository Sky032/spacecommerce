import config from "./config.js";
import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import GoogleStrategy from 'passport-google-oauth2';
import jwt from 'passport-jwt';
// import User from '../dao/mongo/users.mongo.js';
import { createHash, generateToken, validatePassword } from "../utils/index.js";
import UserModel from "../dao/mongo/models/users.model.js";
import { UsersService, CartsService } from "../repository/index.js";

// const usersService = new User();

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;


const cookieExtractor = req => {
    const token = (req && req.cookies) ? req.cookies[config.COOKIE_NAME] : null;
    return token
}

const initializePassport = () => {

    // Register
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, 
        usernameField: 'email'
    },
    async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const user = await UsersService.getUser(username);
            if (user) {
                alert(`Already exists a user with email ${username}`);
                return done(null, user);
            }

            const newUser = {
                first_name: first_name,
                last_name: last_name,
                email: email, 
                social: 'local',
                age: age || '',
                cart: await CartsService.createCart(),
                documents: [],
                password: createHash(password)
            }

            const result = await UsersService.createUser(newUser);

            if (result.email === 'adminCoder@coder.com' || result.email === 'msbuiz@hotmail.com') {
                result.rol = 'admin'
                await result.save();
                return done(null, result);
            }

            await result.save();
            return done(null, result)

        } catch (error) {
            console.log(error);
            return done(`There's been an error trying to register: `, error.message)
        }
    }))

    // Login Github
    passport.use('github', new GitHubStrategy({
        clientID: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET,
        callbackURL: config.GITHUB_CALLBACKURL_PRODUCTION
    },
    async(accessToken, refreshToken, profile, done) => {
        try {
            const user = await UsersService.getUser(profile._json.email)
            if(user) {
                return done(null, user);
            }

            const newUser = {
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                social: 'GitHub',
                age: '',
                documents: [],
            }

            const result = await UsersService.createUser(newUser);
            if (result.email === 'adminCoder@coder.com' || result.email === 'msbuiz@hotmail.com') {
                result.rol = 'admin'
                await result.save();
                return done(null, result);
            }

            if (result.cart === undefined) {
                result.cart = await CartsService.createCart(),
                await result.save();
                return done(null, result);
            }

            await result.save();
            return done(null, result);

        } catch (error) {
            return done(`There's been an error authenticating with GitHub: `, error.message)
        }
    }));

    // Login Google
    passport.use('google', new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACKURL_PRODUCTION,
        passReqToCallback: true
    },
    async(request, accessToken, refreshToken, profile, done) => {
        try {
            const user = await UsersService.getUser(profile._json.email);
            if(user) {
                console.log(`Already exists a user with email ${profile._json.email}`);
                return done(null, user);
            }

            const newUser = {
                first_name: profile._json.given_name,
                last_name: profile._json.family_name,
                email: profile._json.email,
                social: 'Google',
                age: '',
                documents: [],
                rol: 'user'
            }

            const result = await UsersService.createUser(newUser);
            
            if(result.email === 'adminCoder@coder.com' || result.email === 'msbuiz@hotmail.com') {
                result.rol = 'admin';
                await result.save();
                return done(null, result);
            }
            
            if (result.cart === undefined) {
                result.cart = await CartsService.createCart(),
                await result.save();
                return done(null, result);
            }
            
            await result.save();
            return done(null, result);

        } catch (error) {
            return done(`Ther's been an error authenticating with Google: `, error)
        }
    }));

    // Login Local
    passport.use('local', new LocalStrategy({
        usernameField: 'email'
    }, 
    async(username, password, done) => {
        try {
            const user = await UsersService.getUser(username);
            if(!user) {
                console.log(`Something's wrong, we culdn't find the user.`);
                return done(null, false)
            }

            if(!validatePassword(user, password)) {
                return done(null, false);
            }

            const token = generateToken(user);
            user.token = token;

            return done(null, user)
        } catch (error) {
            console.error(error)
            return done(`Ups, something went wrong:`, error);
        }
    }))

    // JWT Passport Strategy
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.PRIVATE_KEY
    },
    async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    });
    
}

export default initializePassport;