import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
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
        loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
