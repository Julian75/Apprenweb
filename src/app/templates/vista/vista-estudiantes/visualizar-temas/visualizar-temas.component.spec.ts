import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarTemasComponent } from './visualizar-temas.component';

describe('VisualizarTemasComponent', () => {
  let component: VisualizarTemasComponent;
  let fixture: ComponentFixture<VisualizarTemasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarTemasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarTemasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
