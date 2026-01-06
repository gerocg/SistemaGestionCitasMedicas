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

    getPacientes() {
        return this.http.get<any>(this.urlBase + "/getPacientes");
    }

    getHistorialClinico(id: number) {
        return this.http.get<any>(`${this.urlBase}/${id}/historial`);
    }

    getMiHistorialClinico() {
        return this.http.get<any>(`${this.urlBase}/me/historial`);
    }

    actualizarPaciente(id: number, data: any) {
        return this.http.put(`${this.urlBase}/${id}`, data);
    }

    buscarPacientes(texto: string) {
        return this.http.get<any>(this.urlBase + "/buscar", { params: { texto } });
    }

    getDatosPaciente() {
        return this.http.get(this.urlBase + "/me");
    }

    actualizarDatos(data: any) {
        return this.http.put(this.urlBase + "/me", data);
    }

    consultaPacientes(texto: string) {
        return this.http.get<any>(this.urlBase + "/consulta", { params: { texto } });
    }

    crearPaciente(data: any) {
        return this.http.post(this.urlBase + "/nuevoPaciente", data);
    }

    getPaciente(id: number) {
        return this.http.get<any>(this.urlBase + '/' + id);
    }
}
