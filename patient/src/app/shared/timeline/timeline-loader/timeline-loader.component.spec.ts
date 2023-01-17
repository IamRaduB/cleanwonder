import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineLoaderComponent } from './timeline-loader.component';

describe('TimelineLoaderComponent', () => {
  let component: TimelineLoaderComponent;
  let fixture: ComponentFixture<TimelineLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
