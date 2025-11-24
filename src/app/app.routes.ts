import { Routes } from '@angular/router'; 
import { AuthGuard } from './guards/auth-guard'; 

export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 

    //Publicas 
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) }, 
    { path: 'registro', loadComponent: () => import('./components/registro/registro').then(m => m.Registro) }, 
    { path: 'recuperarContrasenia', loadComponent: () => import('./components/recuperar-contrasenia/recuperar-contrasenia').then(m => m.RecuperarContrasenia) },

    //Privadas 
    { path: 'inicio', loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio), 
    // canActivate: [AuthGuard], 
    children: [ 
        { path: '', redirectTo: 'calendario', pathMatch: 'full' }, 
        { path: 'calendario', loadComponent: () => import('./components/calendario/calendario').then(m => m.Calendario) }, 
        { path: 'nuevaCita', loadComponent: () => import('./components/nueva-cita/nueva-cita').then(m => m.NuevaCita) }, 
        { path: 'consultaCitas', loadComponent: () => import('./components/consulta-citas/consulta-citas').then(m => m.ConsultaCitas) } 
    ]}, 
    { path: '**', redirectTo: 'login' } 
];