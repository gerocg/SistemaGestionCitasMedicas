import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/toast/toast';
import { Spinner } from './shared/spinner/spinner';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token && this.authService.expiroToken(token)) {
      this.authService.logout();
    }
  }
  protected readonly title = signal('proyectoFinal');
}
