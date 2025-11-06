import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../login-service';


 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  LoginService = inject(LoginService);

  constructor() { 
    this.LoginService.Login('gero123', '12345').subscribe({
      next: (data) => {
        console.log('Login exitoso:', data);
      },
      error: (error) => {
        console.error('Error en el login:', error);
      }
    });
  }
}
