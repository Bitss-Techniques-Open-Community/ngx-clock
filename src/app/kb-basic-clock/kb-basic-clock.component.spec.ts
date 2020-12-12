import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KbBasicClockComponent } from './kb-basic-clock.component';

describe('KbBasicClockComponent', () => {
  let component: KbBasicClockComponent;
  let fixture: ComponentFixture<KbBasicClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KbBasicClockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KbBasicClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
