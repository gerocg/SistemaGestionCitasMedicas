import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _toasts = signal<any[]>([]);
  toasts = this._toasts.asReadonly();

  show(message: string, type: 'success' | 'error' = 'success') {
    const toast = { message, type };

    this._toasts.update(list => [...list, toast]);

    setTimeout(() => {
      this.remove(toast);
    }, 3000);
  }

  // success(message: string) {
  //   this.show(message, 'success');
  // }

  // error(message: string) {
  //   this.show(message, 'error');
  // }

  remove(toast: any) {
    this._toasts.update(list =>
      list.filter(t => t !== toast)
    );
  }
}
