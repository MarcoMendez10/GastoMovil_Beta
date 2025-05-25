import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BencinerasPage } from './bencineras.page';

describe('BencinerasPage', () => {
  let component: BencinerasPage;
  let fixture: ComponentFixture<BencinerasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BencinerasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
