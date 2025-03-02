import { bootstrapApplication } from '@angular/platform-browser';
// the app's providers are in app.config.ts
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
