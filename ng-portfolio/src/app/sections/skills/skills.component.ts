import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { ContentService, type SiteContent } from '../../core/content.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  categories: { title: string; icon: string; skills: string[] }[] = [];
  constructor(content: ContentService) {
    const c: SiteContent = content.load();
    this.categories = (c.skillsTabs || []).map(t => ({
      title: t.title,
      icon: 'lightning-charge-fill',
      skills: (t.items || []).map(i => `${i.name} ${i.percent}%`)
    }));
  }
}
