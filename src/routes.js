import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.js';
import projectssRouter from './core/projects/projects.router.js';
import employeesRouter from './core/employees/employees.router.js';
import clientsRouter from './core/clients/clients.router.js';
import team_members from './core/project_team_members/project_team_members.router.js';
import project_teamsRouter from './core/project_teams/project_teams.router.js';
import pic_clientsRouter from './core/client_pic/client_pic.router.js';
import documnent from './core/documents/documents.router.js';
import path from 'path';
import dashboard from './core/dashboard/dashboard.router.js';
import role_levelsRouter from './core/role_levels/role_levels.router.js';

const router = express.Router();


export const routeLists = [
    {
        path : '/auth',
        route: authenticationRouter
    },
    {
        path : '/employees',
        route: employeesRouter
    },
    {
        path : '/role_levels',
        route: role_levelsRouter
    }
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
    },
    {
        path : '/documents',
        route: documnent
    },
    {
        path : '/dashboard',
        route: dashboard
    }
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;