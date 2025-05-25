import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiAutoPage } from './mi-auto.page';

describe('MiAutoPage', () => {
  let component: MiAutoPage;
  let fixture: ComponentFixture<MiAutoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiAutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
