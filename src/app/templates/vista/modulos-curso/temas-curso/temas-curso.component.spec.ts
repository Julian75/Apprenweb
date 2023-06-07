import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemasCursoComponent } from './temas-curso.component';

describe('TemasCursoComponent', () => {
  let component: TemasCursoComponent;
  let fixture: ComponentFixture<TemasCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemasCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemasCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
