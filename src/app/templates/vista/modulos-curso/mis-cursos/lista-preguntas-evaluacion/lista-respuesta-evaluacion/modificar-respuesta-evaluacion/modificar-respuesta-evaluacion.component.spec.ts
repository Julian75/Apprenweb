import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarRespuestaEvaluacionComponent } from './modificar-respuesta-evaluacion.component';

describe('ModificarRespuestaEvaluacionComponent', () => {
  let component: ModificarRespuestaEvaluacionComponent;
  let fixture: ComponentFixture<ModificarRespuestaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarRespuestaEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarRespuestaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
