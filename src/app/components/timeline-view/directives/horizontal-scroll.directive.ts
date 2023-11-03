import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHorizontalScroll]'
})
export class HorizontalScrollDirective {
  private isDragging = false;
  private initialX = 0;
  private initialScrollLeft = 0;

  @Input("appHorizontalScroll") activateGrabFunctionality: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (this.activateGrabFunctionality) {
        this.isDragging = true;
        this.initialX = event.clientX;
        this.initialScrollLeft = this.el.nativeElement.scrollLeft;
        event.preventDefault();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.initialX;
      this.el.nativeElement.scrollLeft = this.initialScrollLeft - deltaX;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.isDragging = false;
  }
}
