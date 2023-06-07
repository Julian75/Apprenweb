import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPreguntaEvaluacionComponent } from './modificar-pregunta-evaluacion.component';

describe('ModificarPreguntaEvaluacionComponent', () => {
  let component: ModificarPreguntaEvaluacionComponent;
  let fixture: ComponentFixture<ModificarPreguntaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarPreguntaEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarPreguntaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
