import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro').then(m => m.Registro)
    },
    {
        path: 'recuperarContrasenia',
        loadComponent: () => import('./components/recuperar-contrasenia/recuperar-contrasenia').then(m => m.RecuperarContrasenia)
    },
    {
        path: 'inicio',
        loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio)
    },
];
