import { inject, Injectable } from '@angular/core';
import { ConfiguracionAgenda } from '../components/interfaces/configuracion-agenda.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {
    private http = inject(HttpClient);
    private urlBase = environment.apiURL + 'api/ConfiguracionCalendario';

    getConfiguracion() {
    return this.http.get<any>(this.urlBase).pipe(map(resp => ({
        horaInicio: resp.horaInicio.substring(0,5),
        horaFin: resp.horaFin.substring(0,5),
        intervaloBase: resp.intervaloBase,
        duracionGenerica: resp.duracionCita
      })));
    }

    guardarConfiguracion(config: ConfiguracionAgenda) {
        const body = {
        horaInicio: config.horaInicio,
        horaFin: config.horaFin,
        intervaloBase: config.intervaloBase,
        duracionCita: config.duracionGenerica
        };

        return this.http.put(this.urlBase, body);
    }
}
