import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendrequestsComponent } from './friendrequests.component';

describe('FriendrequestsComponent', () => {
  let component: FriendrequestsComponent;
  let fixture: ComponentFixture<FriendrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendrequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
