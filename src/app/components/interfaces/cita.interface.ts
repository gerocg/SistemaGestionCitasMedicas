import { Archivo } from './archivo.interface';

export interface Cita {
  id_cita: number;
  fechaAgendado: string;
  fechaRealizada?: string;
  comentario: string;
  archivos: Archivo[];
}