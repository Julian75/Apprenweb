import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSeccionCursoComponent } from './agregar-seccion-curso.component';

describe('AgregarSeccionCursoComponent', () => {
  let component: AgregarSeccionCursoComponent;
  let fixture: ComponentFixture<AgregarSeccionCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarSeccionCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarSeccionCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
