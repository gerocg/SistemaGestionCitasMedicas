import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  
  constructor(private toastService: ToastService) {}
  
  get toasts() {
    return this.toastService.toasts;
  }
  
  cerrar(t: any) {
    this.toastService.remove(t);
  }
}
