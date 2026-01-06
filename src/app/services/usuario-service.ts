import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    constructor(private router: Router) { }
    private http = inject(HttpClient);
    private urlBase = environment.apiURL + 'api/Usuario';

    getMe() {
        return this.http.get(this.urlBase + "/me");
    }

    updateMe(data: any) {
        return this.http.put(this.urlBase + "/me", data);
    }
}
