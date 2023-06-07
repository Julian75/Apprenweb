import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAccesoComponent } from './agregar-acceso.component';

describe('AgregarAccesoComponent', () => {
  let component: AgregarAccesoComponent;
  let fixture: ComponentFixture<AgregarAccesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarAccesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarAccesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
