import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarModuloComponent } from './modificar-modulo.component';

describe('ModificarModuloComponent', () => {
  let component: ModificarModuloComponent;
  let fixture: ComponentFixture<ModificarModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarModuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
