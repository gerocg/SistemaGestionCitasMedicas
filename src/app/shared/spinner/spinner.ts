import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-spinner',
  imports: [AsyncPipe],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class Spinner {
  constructor(public spinner: SpinnerService) {}
}
