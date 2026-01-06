import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { BloqueoHorario } from "../components/interfaces/bloqueo-horario.interface";

@Injectable({ 
    providedIn: 'root' 
})

export class BloqueoHorariosService {
    private http = inject(HttpClient);
    private url = environment.apiURL + 'api/BloqueoHorario';

    getBloqueos(desde?: string, hasta?: string) {
        let params: any = {};
        if (desde) params.desde = desde;
        if (hasta) params.hasta = hasta;

        return this.http.get<BloqueoHorario[]>(this.url, { params });
    }

    crear(bloqueo: BloqueoHorario) {
        return this.http.post(this.url, bloqueo);
    }

    eliminar(id: number) {
        return this.http.delete(`${this.url}/${id}`);
    }
}
