import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingToolsComponent } from './marketing-tools.component';

describe('MarketingToolsComponent', () => {
  let component: MarketingToolsComponent;
  let fixture: ComponentFixture<MarketingToolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
