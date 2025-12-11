import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';

import usersRouter from './core/users/users.router.js';
const router = express.Router();


export const routeLists = [
    {
        path : '/auth',
        route: authenticationRouter
    },
    {
        path : '/users',
        route: usersRouter
    },


]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;