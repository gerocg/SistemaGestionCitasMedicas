import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Confirmar } from '../shared/confirmar/confirmar';

@Injectable({ providedIn: 'root' })
export class ConfirmacionService {

  constructor(private dialog: MatDialog) {}

  confirmar(options: {
    titulo: string;
    mensaje: string;
    textoConfirmar?: string;
    textoCancelar?: string;
  }) {
    const dialogRef = this.dialog.open(Confirmar, {
      width: '400px',
      disableClose: true,
      data: options
    });

    return dialogRef.afterClosed();
  }
}
