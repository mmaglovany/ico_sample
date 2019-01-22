import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IcoPageComponent } from './ico-page.component';

describe('IcoPageComponent', () => {
  let component: IcoPageComponent;
  let fixture: ComponentFixture<IcoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IcoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IcoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
