import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimedItemsComponent } from './claimed-items.component';

describe('ClaimedItemsComponent', () => {
  let component: ClaimedItemsComponent;
  let fixture: ComponentFixture<ClaimedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimedItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
