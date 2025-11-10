import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../login-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  LoginService = inject(LoginService);

  
  usuario: string = '';
  contrasenia: string = '';

  constructor(private router: Router) { 
    
  }

  onLogin(){
    this.LoginService.Login('gero123', '12345').subscribe({
      next: (data) => {
        console.log('Login exitoso:', data);
        localStorage.setItem('usuario', JSON.stringify(data));
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
      }
    });
  }
}
