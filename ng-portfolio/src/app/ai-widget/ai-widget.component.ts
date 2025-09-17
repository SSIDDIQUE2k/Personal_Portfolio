import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';

type Msg = { from: 'user' | 'ai'; text: string };

@Component({
  selector: 'app-ai-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('panel', [
      state('closed', style({ opacity: 0, transform: 'translateY(16px) scale(0.98)', pointerEvents: 'none' })),
      state('open', style({ opacity: 1, transform: 'translateY(0) scale(1)', pointerEvents: 'auto' })),
      transition('closed => open', animate('180ms ease-out')),
      transition('open => closed', animate('140ms ease-in')),
    ]),
  ],
  templateUrl: './ai-widget.component.html',
  styleUrl: './ai-widget.component.scss'
})
export class AiWidgetComponent {
  open = false;
  input = '';
  history: Msg[] = [
    { from: 'ai', text: 'Hi! How can I help with your project or AWS setup?' }
  ];

  toggle() { this.open = !this.open; }

  send() {
    const trimmed = this.input.trim();
    if (!trimmed) return;
    this.history.push({ from: 'user', text: trimmed });
    this.input = '';
    setTimeout(() => {
      this.history.push({ from: 'ai', text: 'Thanks! I’ll review and get back with a plan.' });
    }, 400);
  }
}

