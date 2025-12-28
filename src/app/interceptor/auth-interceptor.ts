import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { EMPTY } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const token = localStorage.getItem('token');
  console.log('AuthInterceptor - Token obtenido:', token);

  if (token) {
    if (authService.expiroToken(token)) {
      authService.logout();
      return EMPTY;
    }

    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token
      }
    });
  }

  return next(req);
};
