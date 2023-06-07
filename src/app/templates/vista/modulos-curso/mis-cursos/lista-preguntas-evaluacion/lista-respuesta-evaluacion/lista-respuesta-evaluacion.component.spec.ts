import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRespuestaEvaluacionComponent } from './lista-respuesta-evaluacion.component';

describe('ListaRespuestaEvaluacionComponent', () => {
  let component: ListaRespuestaEvaluacionComponent;
  let fixture: ComponentFixture<ListaRespuestaEvaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaRespuestaEvaluacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaRespuestaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
