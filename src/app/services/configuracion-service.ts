import { Injectable } from '@angular/core';
import { ConfiguracionAgenda } from '../components/interfaces/configuracion-agenda.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfiguracionService {
    
    private config: ConfiguracionAgenda = {
        horaInicio: '08:00',
        horaFin: '18:00',
        intervaloBase: 30,
        duracionGenerica: 30
    };
    
    constructor() {
        this.cargarDesdeStorage();
    }

    private cargarDesdeStorage() {
        const data = localStorage.getItem('configAgenda');
        if (data) {
        this.config = JSON.parse(data) as ConfiguracionAgenda;
        }
    }

    getConfiguracion(): ConfiguracionAgenda {
        return this.config;
    }

    setConfiguracion(config: ConfiguracionAgenda) {
        this.config = config;
        localStorage.setItem('configAgenda', JSON.stringify(config));
    }
}
