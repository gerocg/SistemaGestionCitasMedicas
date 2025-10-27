import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Saludos } from './saludos';

describe('Saludos', () => {
  let component: Saludos;
  let fixture: ComponentFixture<Saludos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Saludos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Saludos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
