import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSeccionesCursoComponent } from './lista-secciones-curso.component';

describe('ListaSeccionesCursoComponent', () => {
  let component: ListaSeccionesCursoComponent;
  let fixture: ComponentFixture<ListaSeccionesCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaSeccionesCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaSeccionesCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
