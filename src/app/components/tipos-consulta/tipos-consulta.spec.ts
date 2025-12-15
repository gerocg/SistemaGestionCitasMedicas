import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposConsulta } from './tipos-consulta';

describe('TiposConsulta', () => {
  let component: TiposConsulta;
  let fixture: ComponentFixture<TiposConsulta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposConsulta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposConsulta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
