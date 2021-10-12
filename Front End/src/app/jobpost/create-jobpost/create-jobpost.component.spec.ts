import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJobpostComponent } from './create-jobpost.component';

describe('CreateJobpostComponent', () => {
  let component: CreateJobpostComponent;
  let fixture: ComponentFixture<CreateJobpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJobpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
