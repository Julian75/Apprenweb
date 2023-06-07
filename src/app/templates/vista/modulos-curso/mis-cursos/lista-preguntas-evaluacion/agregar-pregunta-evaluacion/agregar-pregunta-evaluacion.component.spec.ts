import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPreguntaEvaluacionComponent } from './agregar-pregunta-evaluacion.component';

describe('AgregarPreguntaEvaluacionComponent', () => {
  let component: AgregarPreguntaEvaluacionComponent;
  let fixture: ComponentFixture<AgregarPreguntaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPreguntaEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarPreguntaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
