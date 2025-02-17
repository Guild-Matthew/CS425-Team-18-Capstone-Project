/* Matthew Guild*/

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

platformBrowserDynamic()
  .bootstrapModule(AppComponent)
  .catch(err => console.error(err));

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
