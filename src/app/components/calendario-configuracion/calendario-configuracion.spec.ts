import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioConfiguracion } from './calendario-configuracion';

describe('CalendarioConfiguracion', () => {
  let component: CalendarioConfiguracion;
  let fixture: ComponentFixture<CalendarioConfiguracion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioConfiguracion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioConfiguracion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
