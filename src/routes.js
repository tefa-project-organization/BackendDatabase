import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import projectssRouter from './core/projects/projects.router.js';
import usersRouter from './core/users/users.router.js';
import clientsRouter from './core/clients/clients.router.js';
import team_members from './core/project_team_members/project_team_members.router.js';
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
        path : '/projects',
        route: projectssRouter
    },
    {
        path : '/clients',
        route: clientsRouter
    },
    {
        path : '/team_members',
        route: team_members
    }
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;