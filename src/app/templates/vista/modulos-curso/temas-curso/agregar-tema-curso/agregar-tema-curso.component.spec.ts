import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTemaCursoComponent } from './agregar-tema-curso.component';

describe('AgregarTemaCursoComponent', () => {
  let component: AgregarTemaCursoComponent;
  let fixture: ComponentFixture<AgregarTemaCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarTemaCursoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTemaCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
