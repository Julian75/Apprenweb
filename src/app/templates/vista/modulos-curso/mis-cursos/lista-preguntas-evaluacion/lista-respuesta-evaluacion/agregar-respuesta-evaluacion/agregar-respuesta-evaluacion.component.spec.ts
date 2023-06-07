import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarRespuestaEvaluacionComponent } from './agregar-respuesta-evaluacion.component';

describe('AgregarRespuestaEvaluacionComponent', () => {
  let component: AgregarRespuestaEvaluacionComponent;
  let fixture: ComponentFixture<AgregarRespuestaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarRespuestaEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarRespuestaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
