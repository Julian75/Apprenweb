import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCursoEstudiantesComponent } from './lista-curso-estudiantes.component';

describe('ListaCursoEstudiantesComponent', () => {
  let component: ListaCursoEstudiantesComponent;
  let fixture: ComponentFixture<ListaCursoEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaCursoEstudiantesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCursoEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
