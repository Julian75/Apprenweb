import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSeccionEvaluacionComponent } from './formulario-seccion-evaluacion.component';

describe('FormularioSeccionEvaluacionComponent', () => {
  let component: FormularioSeccionEvaluacionComponent;
  let fixture: ComponentFixture<FormularioSeccionEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioSeccionEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioSeccionEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
