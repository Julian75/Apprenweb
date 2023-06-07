import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCursoEstudianteComponent } from './agregar-curso-estudiante.component';

describe('AgregarCursoEstudianteComponent', () => {
  let component: AgregarCursoEstudianteComponent;
  let fixture: ComponentFixture<AgregarCursoEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarCursoEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCursoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
