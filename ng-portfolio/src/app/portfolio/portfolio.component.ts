import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- This will be populated by the main portfolio content -->
    <div>Portfolio Content Goes Here</div>
  `
})
export class PortfolioComponent {
}


