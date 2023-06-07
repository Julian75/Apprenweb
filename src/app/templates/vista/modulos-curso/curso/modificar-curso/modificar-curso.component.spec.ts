import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCursoComponent } from './modificar-curso.component';

describe('ModificarCursoComponent', () => {
  let component: ModificarCursoComponent;
  let fixture: ComponentFixture<ModificarCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
