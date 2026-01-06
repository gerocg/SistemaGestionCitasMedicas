import { Routes } from '@angular/router'; 
import { AuthGuard } from './guards/auth-guard'; 
import { NoAuthGuard } from './guards/no-auth-guard';

export const routes: Routes = [ 
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 

    //Publicas 
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login), canActivate: [NoAuthGuard]}, 
    { path: 'registro', loadComponent: () => import('./components/registro/registro').then(m => m.Registro), canActivate: [NoAuthGuard] }, 
    { path: 'recuperarContrasenia', loadComponent: () => import('./components/recuperar-contrasenia/recuperar-contrasenia').then(m => m.RecuperarContrasenia), canActivate: [NoAuthGuard] },
    
    //Privadas 
    { path: 'inicio', loadComponent: () => import('./components/inicio/inicio').then(m => m.Inicio), 
        canActivate: [AuthGuard], 
        children: [ 
            { path: '', redirectTo: 'calendario', pathMatch: 'full' }, 
            { path: 'calendario', loadComponent: () => import('./components/calendario/calendario').then(m => m.Calendario) }, 
            { path: 'nuevaCita', loadComponent: () => import('./components/nueva-cita/nueva-cita').then(m => m.NuevaCita) }, 
            { path: 'editarCita/:id', loadComponent: () => import('./components/nueva-cita/nueva-cita').then(m => m.NuevaCita) },
            { path: 'verCita/:id', loadComponent: () => import('./components/nueva-cita/nueva-cita').then(m => m.NuevaCita) },
            { path: 'datosPersonales', loadComponent: () => import('./components/datos-personales/datos-personales').then(m => m.DatosPersonales) }, 
            { path: 'calendarioConfiguracion', loadComponent: () => import('./components/calendario-configuracion/calendario-configuracion').then(m => m.CalendarioConfiguracion) },
            { path: 'bloqueoHorarios', loadComponent: () => import('./components/bloqueo-horarios/bloqueo-horarios').then(m => m.BloqueoHorarios) }, 
            { path: 'tiposConsulta', loadComponent: () => import('./components/tipos-consulta/tipos-consulta').then(m => m.TiposConsulta) }, 
            { path: 'consultaCitas', loadComponent: () => import('./components/consulta-citas/consulta-citas').then(m => m.ConsultaCitas) },
            { path: 'nuevoPaciente', loadComponent: () => import('./components/nuevo-paciente/nuevo-paciente').then(m => m.NuevoPaciente) },
            { path: 'editarPaciente/:id', loadComponent: () => import('./components/nuevo-paciente/nuevo-paciente').then(m => m.NuevoPaciente) },
            { path: 'verPaciente/:id', loadComponent: () => import('./components/nuevo-paciente/nuevo-paciente').then(m => m.NuevoPaciente) },
            { path: 'consultaPacientes', loadComponent: () => import('./components/consulta-pacientes/consulta-pacientes').then(m => m.ConsultaPacientes) },
            { path: 'cambiarContrasenia', loadComponent: () => import('./components/cambiar-contrasenia/cambiar-contrasenia').then(m => m.CambiarContrasenia)},
            { path: 'historialClinico', loadComponent: () => import('./components/historial-clinico/historial-clinico').then(m => m.HistorialClinico)},
    ]}, 
    { path: '**', redirectTo: 'login' } 
];