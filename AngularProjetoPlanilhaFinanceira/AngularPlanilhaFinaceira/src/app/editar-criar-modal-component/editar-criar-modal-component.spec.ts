import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriarModalComponent } from './editar-criar-modal-component';

describe('EditarCriarModalComponent', () => {
  let component: EditarCriarModalComponent;
  let fixture: ComponentFixture<EditarCriarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCriarModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCriarModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
