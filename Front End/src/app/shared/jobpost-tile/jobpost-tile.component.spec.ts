import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobpostTileComponent } from './jobpost-tile.component';

describe('JobpostTileComponent', () => {
  let component: JobpostTileComponent;
  let fixture: ComponentFixture<JobpostTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobpostTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobpostTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
