import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationLogsComponent } from './registration-logs.component';

describe('RegistrationLogsComponent', () => {
  let component: RegistrationLogsComponent;
  let fixture: ComponentFixture<RegistrationLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
