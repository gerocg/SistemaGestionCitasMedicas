import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.Login)
    },
    {
        path: 'registro',
        loadComponent: () => import('./registro/registro').then(m => m.Registro)
    },
    {
        path: 'recuperarContrasenia',
        loadComponent: () => import('./recuperar-contrasenia/recuperar-contrasenia').then(m => m.RecuperarContrasenia)
    },
];
