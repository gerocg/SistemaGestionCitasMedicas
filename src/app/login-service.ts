import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor() { }
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + 'api/Pacientes/login';

  public Login(usuario: string, contrasenia: string) {
    return this.http.post<any>(this.urlBase, {
      usuario: usuario,
      contrasenia: contrasenia
    });
  }

}
