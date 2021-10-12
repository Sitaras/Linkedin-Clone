import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJobpostComponent } from './view-jobpost.component';

describe('ViewJobpostComponent', () => {
  let component: ViewJobpostComponent;
  let fixture: ComponentFixture<ViewJobpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewJobpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewJobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
