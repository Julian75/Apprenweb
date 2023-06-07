import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarContenidoCursoComponent } from './agregar-contenido-curso.component';

describe('AgregarContenidoCursoComponent', () => {
  let component: AgregarContenidoCursoComponent;
  let fixture: ComponentFixture<AgregarContenidoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarContenidoCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarContenidoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
