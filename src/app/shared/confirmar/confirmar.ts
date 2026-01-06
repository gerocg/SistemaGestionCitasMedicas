import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmar',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmar.html',
  styleUrl: './confirmar.css',
})
export class Confirmar {

  constructor(
    public dialogRef: MatDialogRef<Confirmar>, @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string;
      mensaje: string;
      textoConfirmar?: string;
      textoCancelar?: string;
    }
  ) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
