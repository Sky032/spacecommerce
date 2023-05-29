import { Cart, Message, Product, User } from '../dao/factory.js';

// Imports de Repositories
import ProductRepository from './products.repository.js';
import CartRepository from './carts.repository.js';
import UserRepository from './users.repository.js';
import MessageRepository from './messages.repository.js';

// Export de Service para usar en Controllers
export const ProductsService = new ProductRepository(new Product())
export const CartsService = new CartRepository(new Cart())
export const UsersService = new UserRepository(new User())
export const MessagesService = new MessageRepository(new Message())
