import { Component, ViewEncapsulation } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendario',
  imports: [FullCalendarModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
  encapsulation: ViewEncapsulation.None
})
export class Calendario {
  calendarOptions: any = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    selectable: true,
    editable: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '21:00:00',
    locale: esLocale,
    events: [
      { title: 'Ejemplo', start: '2025-11-23T10:00', end: '2025-11-23T11:00' }
    ],
    dateClick: this.onDateClick.bind(this),
    select: this.onSelect.bind(this),
    eventDrop: this.onEventDrop.bind(this),
    eventResize: this.onEventResize.bind(this)
  };

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
}
