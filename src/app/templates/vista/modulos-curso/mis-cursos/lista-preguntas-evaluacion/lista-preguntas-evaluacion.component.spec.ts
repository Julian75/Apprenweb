import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPreguntasEvaluacionComponent } from './lista-preguntas-evaluacion.component';

describe('ListaPreguntasEvaluacionComponent', () => {
  let component: ListaPreguntasEvaluacionComponent;
  let fixture: ComponentFixture<ListaPreguntasEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPreguntasEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPreguntasEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
