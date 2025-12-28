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

    GetPacientes() {
        return this.http.get<any>(this.urlBase + "/getPacientes");
    }

    ObtenerDatosPaciente(id: number) {
        return this.http.get<any>(this.urlBase + "/" + id);
    }

    ObtenerPerfil() {
        return this.http.get<any>(`${this.urlBase}/me`);
    }

    ActualizarPerfil(payload: any) {
        return this.http.put(`${this.urlBase}/me`, payload);
    }

    getHistorialClinico() {
        return this.http.get<any[]>(
            `${this.urlBase}/me/historial-clinico`
        );
    }

    ActualizarPaciente(data: any) {
        return this.http.put<any>(this.urlBase + "/update", data);
    }
}
