import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarSeccionCursoComponent } from './modificar-seccion-curso.component';

describe('ModificarSeccionCursoComponent', () => {
  let component: ModificarSeccionCursoComponent;
  let fixture: ComponentFixture<ModificarSeccionCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarSeccionCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarSeccionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
