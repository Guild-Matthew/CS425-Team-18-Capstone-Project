import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateuserComponent } from './deactivateuser.component';

describe('DeactivateuserComponent', () => {
  let component: DeactivateuserComponent;
  let fixture: ComponentFixture<DeactivateuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DeactivateuserComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
