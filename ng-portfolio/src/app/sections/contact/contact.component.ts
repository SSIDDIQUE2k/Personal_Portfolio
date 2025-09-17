import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/reveal-on-scroll.directive';
import { FormsModule } from '@angular/forms';
import { ContentService, type SiteContent } from '../../core/content.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RevealOnScrollDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  form = { firstName: '', lastName: '', email: '', phone: '', message: '' };
  c: SiteContent;
  constructor(content: ContentService) {
    this.c = content.load();
  }

  submit(): void {
    // Placeholder submit; wire to backend/email service as needed
    alert('Thanks! I will get back to you shortly.');
  }
}
