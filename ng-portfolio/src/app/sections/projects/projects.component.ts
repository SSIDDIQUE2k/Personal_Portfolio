import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { ContentService, type SiteContent } from '../../core/content.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RevealOnScrollDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects: { title: string; description: string; image: string; tags: string[]; liveUrl?: string; githubUrl?: string }[] = [];
  constructor(content: ContentService) {
    const c: SiteContent = content.load();
    this.projects = (c.projects || []).map(p => ({
      title: p.title,
      description: p.detailsDescription,
      image: p.image,
      tags: (p.technologies || '').split(/[,\s]+/).filter(Boolean).slice(0, 5),
      liveUrl: p.demoUrl
    }));
  }
}
