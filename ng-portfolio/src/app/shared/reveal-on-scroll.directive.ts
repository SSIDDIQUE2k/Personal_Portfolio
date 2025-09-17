import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private rd: Renderer2) {}

  ngOnInit(): void {
    this.rd.addClass(this.el.nativeElement, 'reveal');
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.rd.addClass(this.el.nativeElement, 'reveal-visible');
          this.observer?.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
