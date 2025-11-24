import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaCitas } from './consulta-citas';

describe('ConsultaCitas', () => {
  let component: ConsultaCitas;
  let fixture: ComponentFixture<ConsultaCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaCitas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaCitas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
