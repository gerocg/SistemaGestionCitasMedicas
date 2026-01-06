import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CitaService {
    constructor() { }
    private http = inject(HttpClient);
    private urlBase = environment.apiURL + 'api/Citas';

    private refrescarCalendario = new Subject<void>();
    refrescarCalendarioObs = this.refrescarCalendario.asObservable();

    nuevaCita(pacienteId: number, fechaHora: string, duracion: number, tratamiento: string, observaciones: string) {
        return this.http.post<any>(this.urlBase + "/nuevaCita", {
            pacienteId: pacienteId,
            fechaHora: fechaHora,
            duracion: duracion,
            tratamiento: tratamiento,
            observaciones: observaciones
        });
    }

    getCitas(fechaInicio: string, fechaFin: string) {
        return this.http.get<any>(this.urlBase + "/getCitasEntreFechas", {
            params: { fechaInicio, fechaFin }
        }); 
    }

    notificarRefrescarCalendario() {
        this.refrescarCalendario.next();
    }

    getCita(id: number) {
        return this.http.get<any>(this.urlBase + '/' + id);
    }

    actualizarCita(id: number, data: any) {
        return this.http.put(this.urlBase + '/' + id, data);
    }

    eliminarCita(id: number) {
        return this.http.delete(this.urlBase + '/' + id);
    }

    filtrarCitas(pacienteId?: number, desde?: string, hasta?: string, estado?: string) {
        let params: any = {};
        if (pacienteId != null) params.pacienteId = pacienteId;
        if (desde) params.desde = desde;
        if (hasta) params.hasta = hasta;
        if (estado) params.estado = estado;
        return this.http.get<any[]>(`${this.urlBase}/filtrar`, { params });
    }

    subirArchivoCita(citaId: number, formData: FormData) {
        return this.http.post(`${this.urlBase}/${citaId}/archivo`, formData);
    }

    eliminarArchivo(archivoId: number) {
        return this.http.delete(`${this.urlBase}/archivo/${archivoId}`);
    }

    cambiarEstado(citaId: number, estado: string) {
       return this.http.put(`${this.urlBase}/${citaId}/estado`, { estado });
    }
}
