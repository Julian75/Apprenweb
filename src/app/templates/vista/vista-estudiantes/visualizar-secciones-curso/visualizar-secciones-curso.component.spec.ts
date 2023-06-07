import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarSeccionesCursoComponent } from './visualizar-secciones-curso.component';

describe('VisualizarSeccionesCursoComponent', () => {
  let component: VisualizarSeccionesCursoComponent;
  let fixture: ComponentFixture<VisualizarSeccionesCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarSeccionesCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarSeccionesCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
