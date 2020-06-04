import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStudentComponent } from './registration-student.component';

describe('RegistrationStudentComponent', () => {
  let component: RegistrationStudentComponent;
  let fixture: ComponentFixture<RegistrationStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
