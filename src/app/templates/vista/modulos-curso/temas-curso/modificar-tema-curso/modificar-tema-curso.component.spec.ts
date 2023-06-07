import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarTemaCursoComponent } from './modificar-tema-curso.component';

describe('ModificarTemaCursoComponent', () => {
  let component: ModificarTemaCursoComponent;
  let fixture: ComponentFixture<ModificarTemaCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarTemaCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarTemaCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
