import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralsMembersComponent } from './referrals-members.component';

describe('ReferralsMembersComponent', () => {
  let component: ReferralsMembersComponent;
  let fixture: ComponentFixture<ReferralsMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralsMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
