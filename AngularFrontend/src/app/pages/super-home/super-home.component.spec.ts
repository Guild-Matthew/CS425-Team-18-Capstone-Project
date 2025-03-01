import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperHomeComponent } from './super-home.component';

describe('SuperHomeComponent', () => {
  let component: SuperHomeComponent;
  let fixture: ComponentFixture<SuperHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [SuperHomeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SuperHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
