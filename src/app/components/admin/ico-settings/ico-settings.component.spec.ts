import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoSettingsComponent } from './ico-settings.component';

describe('IcoSettingsComponent', () => {
  let component: IcoSettingsComponent;
  let fixture: ComponentFixture<IcoSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
