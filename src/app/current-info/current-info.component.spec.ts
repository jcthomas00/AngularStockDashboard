import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentInfoComponent } from './current-info.component';

describe('CurrentInfoComponent', () => {
  let component: CurrentInfoComponent;
  let fixture: ComponentFixture<CurrentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
