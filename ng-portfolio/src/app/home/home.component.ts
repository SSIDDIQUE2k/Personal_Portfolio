import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../sections/hero/hero.component';
import { SkillsComponent } from '../sections/skills/skills.component';
import { ProjectsComponent } from '../sections/projects/projects.component';
import { ContactComponent } from '../sections/contact/contact.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeroComponent, SkillsComponent, ProjectsComponent, ContactComponent],
  template: `
    <app-hero />
    <app-skills />
    <app-projects />
    <app-contact />
  `
})
export class HomeComponent {}

