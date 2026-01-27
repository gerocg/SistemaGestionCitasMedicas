import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { ConfiguracionService } from '../../services/configuracion-service';
import { ConfiguracionAgenda } from '../interfaces/configuracion-agenda.interface';
import { CitaService } from '../../services/cita-service';
import { DatesSetArg, EventInput } from '@fullcalendar/core/index.js';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner-service';
import { ToastService } from '../../services/toast-service';
import { BloqueoHorariosService } from '../../services/bloqueo-horarios.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-calendario',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
  encapsulation: ViewEncapsulation.None
})

export class Calendario implements OnInit, AfterViewInit{
  
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarOptions: any;
  configuracion!: ConfiguracionAgenda;

  constructor(private configuracion_service: ConfiguracionService, private cita_service: CitaService, 
    private router: Router, private spinner_service: SpinnerService, private toast_service: ToastService,
    private bloqueo_service: BloqueoHorariosService, private cd: ChangeDetectorRef, private auth_service: AuthService){}
  
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
    this.configuracion_service.getConfiguracion().subscribe({
      next: (config) => {
        this.configuracion = config;
        this.inicializarCalendario();
        this.cd.detectChanges();
      }, error: (error) => {
        this.toast_service.show(error?.error ?? 'Error al cargar configuracion.', 'error');
        console.error('Error al cargar la configuración:', error);
      }
    });
  }

  inicializarCalendario() {
    this.calendarOptions = {
      initialView: this.getTamanioPantallaInicial(),
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      height: 'auto',
      contentHeight: 'auto',
      selectable: true,
      editable: !this.esPaciente(),
      eventStartEditable: !this.esPaciente(),
      eventDurationEditable: !this.esPaciente(),
      slotMinTime: this.configuracion.horaInicio,
      slotMaxTime: this.calcularSlotMaxTime(this.configuracion.horaFin, this.configuracion.intervaloBase),  
      slotDuration: this.mascaraDuracion(this.configuracion.intervaloBase),
      slotLabelInterval: this.mascaraDuracion(this.configuracion.intervaloBase),
      locale: esLocale,
      validRange: this.esPaciente() ? { start: this.hoySinHora() } : undefined,
      windowResize: () => {
        setTimeout(() => this.cambioTamanioPantalla());
      },
      events: (info: DatesSetArg, successCallback: (events: EventInput[]) => void, failureCallback: (error: any) => void) => {
        setTimeout(() => this.spinner_service.show());
        forkJoin({
          citas: this.cita_service.getCitas(info.startStr, info.endStr),
          bloqueos: this.bloqueo_service.getBloqueos(info.startStr, info.endStr)
        }).subscribe({
          next: ({ citas, bloqueos }) => {
            const eventosCitas: EventInput[] = citas.map((e: any) => ({
              id: e.id,
              title: this.insertarTitulo(e),
              start: e.inicio,
              end: e.fin  ,
              classNames: [
                  this.esPaciente() && e.pacienteId !== this.auth_service.getUserId() ? 'cita-ocupada' : e.estado === 'Realizada' || e.estado === 'Inasistencia' ? 'cita-realizada' : 'cita-confirmada'
              ],
              editable: !this.esPaciente(),
              extendedProps: {
                tipo: 'cita',
                estado: e.estado
              }
            }));
            const eventosBloqueos: EventInput[] = bloqueos.map(b => {
              let end = new Date(b.fechaHasta);
              end.setMinutes(end.getMinutes() + this.configuracion.intervaloBase);
              return {
                id: `bloqueo-${b.id}`,
                start: b.fechaDesde,
                end,
                display: 'background',
                overlap: false,
                editable: false,
                backgroundColor: '#f44336',
                extendedProps: {
                  tipo: 'bloqueo',
                  motivo: b.motivo
                }
              };
            });

            setTimeout(() => this.spinner_service.hide());
            successCallback([...eventosBloqueos, ...eventosCitas]);
          },
          error: err => {
            setTimeout(() => this.spinner_service.hide());
            console.error(err);
            failureCallback(err);
          }
        });
      },
      selectAllow: (selectInfo: any) => {
        const hoy = this.hoySinHora();
        if (selectInfo.start < hoy) {
          return false;
        }
        let eventos = this.calendarComponent.getApi().getEvents();
        return !eventos.some(e => (e.extendedProps?.['tipo'] === 'bloqueo' || e.extendedProps?.['tipo'] === 'cita') && selectInfo.start < e.end! && selectInfo.end > e.start!);      
      },
      dateClick: this.onDateClick.bind(this),
      select: this.onSelect.bind(this),
      eventDrop: this.onEventDrop.bind(this),
      eventResize: this.onEventResize.bind(this),
      eventClick: this.onEventClick.bind(this),
      eventDidMount: (info: any) => {
        if (info.event.extendedProps?.tipo === 'bloqueo') {
          info.el.title = info.event.extendedProps.motivo || 'Horario bloqueado';
        }
      }
    };
  }

  onEventClick(info: any) {
    if (info.event.extendedProps?.tipo === 'bloqueo') return;

    if (this.esPaciente()) {
      this.toast_service.show('Este horario no está disponible', 'error');
      return;
    }
   
    let citaId = info.event.id;
    let estado = info.event.extendedProps.estado;

    if(estado === 'Confirmada') {
      this.router.navigate(['/inicio/editarCita', citaId]);
    } else {
      this.router.navigate(['/inicio/verCita', citaId], { queryParams: { mode: 'ver' } });
    }
  }
  
  onDateClick(arg: DateClickArg) {
    let fechaClick = arg.date;
    if (fechaClick < this.hoySinHora()) return;
    let calendarApi = this.calendarComponent.getApi();
    let eventos = calendarApi.getEvents();

    let ocupado = eventos.some(e => (e.extendedProps?.['tipo'] === 'bloqueo' || e.extendedProps?.['tipo'] === 'cita') && fechaClick >= e.start! && fechaClick < e.end!);

    if (ocupado) {
      this.toast_service.show('Horario no disponible', 'error');
      return;
    }

    this.cita_service.setearFechaHora(arg.dateStr);
    this.router.navigate(['/inicio/nuevaCita'], { queryParams: { mode: 'nueva' } });
  }


  onSelect(info: any) {
    let calendarApi = this.calendarComponent.getApi();
    let eventos = calendarApi.getEvents();

    const hayBloqueo = eventos.some(e => e.extendedProps?.['tipo'] === 'bloqueo' && info.start < e.end! && info.end > e.start!);

    if (hayBloqueo) {
      this.toast_service.show('El horario seleccionado está bloqueado', 'error');
      calendarApi.unselect();
      return;
    }
  }

  onEventDrop(info: any) {
    if (this.eventoCaeEnBloqueo(info)) {
      this.toast_service.show('No se puede mover la cita a un horario bloqueado', 'error');
      info.revert();
      return;
    }
  }

  onEventResize(info: any) {
    if (this.eventoCaeEnBloqueo(info)) {
      this.toast_service.show('No se puede ajustar la cita a un horario bloqueado', 'error');
      info.revert();
      return;
    }
  }

  eventoCaeEnBloqueo(info: any): boolean {
    let calendarApi = this.calendarComponent.getApi();
    let eventos = calendarApi.getEvents();
    return eventos.some(e => e.extendedProps?.['tipo'] === 'bloqueo' && info.event.start! < e.end! && info.event.end! > e.start!);
  }

  mascaraDuracion(min: number): string {
    return `00:${min.toString().padStart(2, '0')}:00`;
  }

  getTamanioPantallaInicial(): string {
    return window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek';
  }

 cambioTamanioPantalla() {
    if (!this.calendarComponent) {
      return;
    }
    let calendarApi = this.calendarComponent.getApi();
    let width = window.innerWidth;
    calendarApi.updateSize();
    if (width < 1000 && calendarApi.view.type !== 'timeGridDay') {
      calendarApi.changeView('timeGridDay');
    }
    if (width >= 1000 && calendarApi.view.type !== 'timeGridWeek') {
      calendarApi.changeView('timeGridWeek');
    }
  }

  calcularSlotMaxTime(horaFin: string, intervalo: number): string {
    let [h, m] = horaFin.split(':').map(Number);
    let totalMin = h * 60 + m + intervalo;
    let hh = Math.floor(totalMin / 60).toString().padStart(2, '0');
    let mm = (totalMin % 60).toString().padStart(2, '0');

    return `${hh}:${mm}`;
  }

  esPaciente(): boolean {
    return this.auth_service.esPaciente();
  }

  hoySinHora(): Date {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  }

  insertarTitulo(e: any): string {
    if (this.esPaciente()) {
      const userId = this.auth_service.getUserId();
      console.log(e);
      return e.pacienteId === userId ? e.titulo : 'Ocupado';
    }
    return e.titulo;
  }
}