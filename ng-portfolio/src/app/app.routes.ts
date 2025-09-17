import { Routes } from '@angular/router';
import { AdminPortalComponent } from './admin/admin-portal.component';
import { Component } from '@angular/core';

// Empty component for home route - actual content is rendered by app.component.html
@Component({
  selector: 'app-home-route',
  template: '',
  standalone: true
})
export class HomeRouteComponent {}

export const routes: Routes = [
  { path: 'admin', component: AdminPortalComponent },
  { path: '', component: HomeRouteComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' } // Catch-all route redirects to home
];
