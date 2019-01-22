import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositsWithdrawalsComponent } from './deposits-withdrawals.component';

describe('DepositsWithdrawalsComponent', () => {
  let component: DepositsWithdrawalsComponent;
  let fixture: ComponentFixture<DepositsWithdrawalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositsWithdrawalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositsWithdrawalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
