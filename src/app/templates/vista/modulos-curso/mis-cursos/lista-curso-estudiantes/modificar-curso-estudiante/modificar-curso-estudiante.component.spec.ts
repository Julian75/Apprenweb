import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCursoEstudianteComponent } from './modificar-curso-estudiante.component';

describe('ModificarCursoEstudianteComponent', () => {
  let component: ModificarCursoEstudianteComponent;
  let fixture: ComponentFixture<ModificarCursoEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarCursoEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarCursoEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
