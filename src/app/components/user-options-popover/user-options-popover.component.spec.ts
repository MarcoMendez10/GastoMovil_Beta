import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserOptionsPopoverComponent } from './user-options-popover.component';

describe('UserOptionsPopoverComponent', () => {
  let component: UserOptionsPopoverComponent;
  let fixture: ComponentFixture<UserOptionsPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [UserOptionsPopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOptionsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
