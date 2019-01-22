import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ReferralsTreeComponent} from "./referrals-tree.component";



describe('ReferralsTreeComponent', () => {
  let component: ReferralsTreeComponent;
  let fixture: ComponentFixture<ReferralsTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralsTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
