import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDeCitas } from './reporte-de-citas';

describe('ReporteDeCitas', () => {
  let component: ReporteDeCitas;
  let fixture: ComponentFixture<ReporteDeCitas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDeCitas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteDeCitas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
