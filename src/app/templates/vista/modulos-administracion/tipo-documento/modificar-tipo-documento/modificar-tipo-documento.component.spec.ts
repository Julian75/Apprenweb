import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarTipoDocumentoComponent } from './modificar-tipo-documento.component';

describe('ModificarTipoDocumentoComponent', () => {
  let component: ModificarTipoDocumentoComponent;
  let fixture: ComponentFixture<ModificarTipoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarTipoDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
