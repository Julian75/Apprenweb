import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarEstadoComponent } from './agregar-estado.component';

describe('AgregarEstadoComponent', () => {
  let component: AgregarEstadoComponent;
  let fixture: ComponentFixture<AgregarEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarEstadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
