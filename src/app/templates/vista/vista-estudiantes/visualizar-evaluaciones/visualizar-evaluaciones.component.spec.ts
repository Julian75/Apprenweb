import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEvaluacionesComponent } from './visualizar-evaluaciones.component';

describe('VisualizarEvaluacionesComponent', () => {
  let component: VisualizarEvaluacionesComponent;
  let fixture: ComponentFixture<VisualizarEvaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarEvaluacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
