import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class PacientesService {
    constructor() { }
    private http = inject(HttpClient);
    private urlBase = environment.apiURL + 'api/Pacientes';

    Login(usuario: string, contrasenia: string) {
        return this.http.post<any>(this.urlBase + "/login", {
            usuario_paciente: usuario,
            contrasenia_paciente: contrasenia
        });
    }

    Register(nombre: string, contrasenia: string, email: string, fechaNacimiento: string, telefono: string) {
        return this.http.post<any>(this.urlBase + "/register", {
            nombre_completo_paciente: nombre,
            email: email,
            contrasenia_paciente: contrasenia,
            fecha_nacimiento: fechaNacimiento,
            telefono: telefono
        });
    }

    ObtenerDatosPaciente(id: number) {
        return this.http.get<any>(this.urlBase + "/" + id);
    }

    ObtenerPerfil() {
        return this.http.get<any>(`${this.urlBase}/pacientes/me`);
    }

    ActualizarPerfil(payload: any) {
        return this.http.put(`${this.urlBase}/pacientes/me`, payload);
    }

    getHistorialClinico() {
        return this.http.get<any[]>(
            `${this.urlBase}/pacientes/me/historial-clinico`
        );
    }

    ActualizarPaciente(data: any) {
        return this.http.put<any>(this.urlBase + "/update", data);
    }

    EnviarRecuperacionContrasenaEmail(email: string) {
        return this.http.post<any>(this.urlBase + "/recuperarContrasena", {
            email: email
        });
    }

    CambiarContrasenia(contrasenia: string) {
        return this.http.post<any>(this.urlBase + "/cambiarContrasenia", {
            nueva_contrasenia: contrasenia
        });
    }

}
