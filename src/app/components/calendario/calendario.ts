import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { ConfiguracionService } from '../../services/configuracion-service';
import { ConfiguracionAgenda } from '../interfaces/configuracion-agenda.interface';

@Component({
  selector: 'app-calendario',
  imports: [FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
  encapsulation: ViewEncapsulation.None
})
export class Calendario implements OnInit{
  
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any;
  configuracion!: ConfiguracionAgenda;

  constructor(private configuracion_service: ConfiguracionService){}
  
  ngOnInit(): void {
    this.configuracion = this.configuracion_service.getConfiguracion();
    this.calendarOptions = {
      initialView: this.getTamanioPantallaInicial(),
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      selectable: true,
      editable: true,
      slotMinTime: this.configuracion.horaInicio,
      slotMaxTime: this.configuracion.horaFin,
      slotDuration: this.mascaraDuracion(this.configuracion.intervaloBase),
      slotLabelInterval: this.mascaraDuracion(this.configuracion.intervaloBase),
      locale: esLocale,
      windowResize: this.cambioTamanioPantalla.bind(this),
      events: [
        { title: 'Ejemplo', start: '2025-11-23T10:00', end: '2025-11-23T11:00' }
      ],
      dateClick: this.onDateClick.bind(this),
      select: this.onSelect.bind(this),
      eventDrop: this.onEventDrop.bind(this),
      eventResize: this.onEventResize.bind(this)
    };
  }


  onDateClick(info: any) {
    console.log('Click en:', info.dateStr);
  }

  onSelect(info: any) {
    console.log('Seleccionaste:', info.startStr, '→', info.endStr);
  }

  onEventDrop(info: any) {
    console.log('Evento movido:', info.event.title, info.event.start, info.event.end);
  }

  onEventResize(info: any) {
    console.log('Evento ajustado:', info.event.title, info.event.start, info.event.end);
  }

  mascaraDuracion(min: number): string {
    return `00:${min.toString().padStart(2, '0')}:00`;
  }

  getTamanioPantallaInicial(): string {
    return window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek';
  }

  cambioTamanioPantalla() {
    const calendarApi = this.calendarComponent.getApi();
    const width = window.innerWidth;
    calendarApi.updateSize();
    if (width < 1000 && calendarApi.view.type !== 'timeGridDay') {
      calendarApi.changeView('timeGridDay');
    }

    if (width >= 1000 && calendarApi.view.type !== 'timeGridWeek') {
      calendarApi.changeView('timeGridWeek');
    }
  }

}
