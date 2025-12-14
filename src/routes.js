import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import clientpic from './core/client_pic/client_pic.router.js';
import project from './core/projects/projects.router.js';
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
    {
        path : '/clientpic',
        route: clientpic
    },
    {   
        path : '/project',
        route: project
    }


]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;