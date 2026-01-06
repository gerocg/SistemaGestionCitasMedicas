import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloqueoHorarios } from './bloqueo-horarios';

describe('BloqueoHorarios', () => {
  let component: BloqueoHorarios;
  let fixture: ComponentFixture<BloqueoHorarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BloqueoHorarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BloqueoHorarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
