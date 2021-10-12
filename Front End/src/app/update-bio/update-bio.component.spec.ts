import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBioComponent } from './update-bio.component';

describe('UpdateBioComponent', () => {
  let component: UpdateBioComponent;
  let fixture: ComponentFixture<UpdateBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
