import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPermissionsComponent } from './edit-permissions.component';

describe('EditPermissionsComponent', () => {
  let component: EditPermissionsComponent;
  let fixture: ComponentFixture<EditPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPermissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
