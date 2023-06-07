import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarModuloComponent } from './agregar-modulo.component';

describe('AgregarModuloComponent', () => {
  let component: AgregarModuloComponent;
  let fixture: ComponentFixture<AgregarModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarModuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
