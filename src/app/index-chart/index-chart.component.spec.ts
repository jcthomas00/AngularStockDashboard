import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexChartComponent } from './index-chart.component';

describe('IndexChartComponent', () => {
  let component: IndexChartComponent;
  let fixture: ComponentFixture<IndexChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
