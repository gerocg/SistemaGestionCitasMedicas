import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private router: Router) { }
    private http = inject(HttpClient);
    private urlBase = environment.apiURL + 'api/Auth';

    roles: string[] = [];

    Login(usuario: string, contrasenia: string) {
        return this.http.post<any>(this.urlBase + "/login", {
            email: usuario,
            contrasenia: contrasenia
        });
    }

    Register(nombre: string, contrasenia: string, email: string, fechaNacimiento: string, telefono: string) {
        return this.http.post<any>(this.urlBase + "/register", {
            nombreCompleto: nombre,
            email: email,
            contrasenia: contrasenia,
            fechaNacimiento: fechaNacimiento,
            telefono: telefono
        });
    }

    EnviarRecuperacionContrasenaEmail(email: string) {
        return this.http.post<any>(this.urlBase + "/recuperarContrasena", {
            email: email
        });
    }

    CambiarContrasenia(contrasenia: string) {
        return this.http.post<any>(this.urlBase + "/cambiarContrasenia", {
            nuevaContrasenia: contrasenia
        });
    }

    setSession(token: string, roles: string[]) {
        localStorage.setItem('token', token);
        localStorage.setItem('roles', JSON.stringify(roles));
        this.roles = roles;
    }

    cargarDesdeStorage() {
        const roles = localStorage.getItem('roles');
        this.roles = roles ? JSON.parse(roles) : [];
    }

    getRoles(): string[] {
        if (!this.roles.length) this.cargarDesdeStorage();
        return this.roles;
    }

    tieneRol(role: string): boolean {
        return this.getRoles().includes(role);
    }

    esPaciente() {
        return this.tieneRol('Paciente');
    }

    esAdmin() {
        return this.tieneRol('Admin');
    }

    esProfesional() {
        return this.tieneRol('Profesional');
    }

    logout() {
        let ultimoUsuario = localStorage.getItem('lastEmail');
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        this.roles = [];
        this.router.navigate(['/login'], 
            { state: { email: ultimoUsuario } 
        });
    }

    expiroToken(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            return Date.now() > exp;
        } catch {
            return true;
        }
    }
}
