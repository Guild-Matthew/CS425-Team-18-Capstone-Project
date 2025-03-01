import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadduserComponent } from './superadduser.component';

describe('SuperadduserComponent', () => {
  let component: SuperadduserComponent;
  let fixture: ComponentFixture<SuperadduserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SuperadduserComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SuperadduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
