import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargarArchivosComponent } from './descargar-archivos.component';

describe('DescargarArchivosComponent', () => {
  let component: DescargarArchivosComponent;
  let fixture: ComponentFixture<DescargarArchivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargarArchivosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescargarArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
