import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit {
  @Input('appParallax') factor = 0.2; // movement factor

  private initialY = 0;

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnInit(): void {
    const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    this.initialY = rect.top + window.scrollY;
    this.update();
  }

  @HostListener('window:scroll')
  onScroll() { this.update(); }

  private update(): void {
    const offset = (window.scrollY - this.initialY) * this.factor;
    this.rd.setStyle(this.el.nativeElement, 'transform', `translateY(${offset}px)`);
    this.rd.setStyle(this.el.nativeElement, 'will-change', 'transform');
  }
}

