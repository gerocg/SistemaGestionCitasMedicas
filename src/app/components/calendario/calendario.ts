import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { ConfiguracionService } from '../../services/configuracion-service';
import { ConfiguracionAgenda } from '../interfaces/configuracion-agenda.interface';
import { CitaService } from '../../services/cita-service';
import { DatesSetArg, EventInput } from '@fullcalendar/core/index.js';
import { Router } from '@angular/router';


@Component({
  selector: 'app-calendario',
  imports: [FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
  encapsulation: ViewEncapsulation.None
})
export class Calendario implements OnInit, AfterViewInit{
  
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any;
  configuracion!: ConfiguracionAgenda;

  constructor(private configuracion_service: ConfiguracionService, private cita_service: CitaService, private router: Router){}
  
  ngAfterViewInit(): void {
    this.cita_service.refrescarCalendarioObs.subscribe(() => {
      if (!this.calendarComponent) {
        console.warn('CalendarComponent todavía no está listo');
        return;
      }

      const calendarApi = this.calendarComponent.getApi();
      console.log('Refrescando eventos del calendario');
      calendarApi.refetchEvents();
    });
  }
  
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
      events: (info: DatesSetArg, successCallback: (events: EventInput[]) => void, failureCallback: (error: any) => void) => {
        console.log('Pidiendo citas:', info.startStr, info.endStr);
        this.cita_service.getCitas(info.startStr, info.endStr)
          .subscribe({
            next: (events) => {
              console.log('Eventos recibidos:', events);
              successCallback(events);
            },
            error: err => {
              console.error('Error al cargar eventos', err);
              failureCallback(err);
            }
          });
      },
      dateClick: this.onDateClick.bind(this),
      select: this.onSelect.bind(this),
      eventDrop: this.onEventDrop.bind(this),
      eventResize: this.onEventResize.bind(this),
      eventClick: this.onEventClick.bind(this),
    };
  }

  onEventClick(info: any) {
    const citaId = info.event.id;
    this.router.navigate(['/inicio/editarCita', citaId]);
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
