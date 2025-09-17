import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { ContentService, SiteContent } from '../../core/content.service';
import { ParallaxDirective } from '../../shared/parallax.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective, ParallaxDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  c: SiteContent;
  constructor(content: ContentService) {
    this.c = content.load();
  }
}
