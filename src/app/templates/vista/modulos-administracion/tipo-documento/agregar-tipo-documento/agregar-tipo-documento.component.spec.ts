import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTipoDocumentoComponent } from './agregar-tipo-documento.component';

describe('AgregarTipoDocumentoComponent', () => {
  let component: AgregarTipoDocumentoComponent;
  let fixture: ComponentFixture<AgregarTipoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarTipoDocumentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
