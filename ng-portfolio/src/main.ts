import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Include Bootstrap JS bundle for navbar/toggles, tooltips, etc.
import 'bootstrap';

// Ensure Angular compiler is available for JIT compilation
import '@angular/compiler';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
