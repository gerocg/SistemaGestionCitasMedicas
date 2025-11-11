import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { NoAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio),
    },
    {
        path: 'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login),
        canActivate: [NoAuthGuard]
    },
    {
        path: 'registro',
        loadComponent: () => import('./components/registro/registro').then(m => m.Registro),
        canActivate: [NoAuthGuard]
    },
    {
        path: 'recuperarContrasenia',
        loadComponent: () => import('./components/recuperar-contrasenia/recuperar-contrasenia').then(m => m.RecuperarContrasenia)
    },
    {
        path: 'inicio',
        loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio),
        canActivate: [AuthGuard]
    }
];
