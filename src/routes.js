import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import projectssRouter from './core/projects/projects.router.js';
import usersRouter from './core/users/users.router.js';
import clientsRouter from './core/clients/clients.router.js';
import team_members from './core/project_team_members/project_team_members.router.js';
import project_teamsRouter from './core/project_teams/project_teams.router.js';
import pic_clientsRouter from './core/client_pic/client_pic.router.js';
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
        path : '/client_pics',
        route: pic_clientsRouter
    },
    {
        path : '/team_members',
        route: team_members
    },
    {
        path : '/project_teams',
        route: project_teamsRouter
    }
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;