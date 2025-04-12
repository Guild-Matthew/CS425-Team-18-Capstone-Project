import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFloorComponent } from './edit-floor.component';

describe('EditFloorComponent', () => {
  let component: EditFloorComponent;
  let fixture: ComponentFixture<EditFloorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFloorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditFloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
