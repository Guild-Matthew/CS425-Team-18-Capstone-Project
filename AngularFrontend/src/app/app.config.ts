//import { ApplicationConfig } from '@angular/core';
//import { provideRouter } from '@angular/router';

//import { routes } from './app.routes';
//import { provideClientHydration } from '@angular/platform-browser';

//export const appConfig: ApplicationConfig = {
//  providers: [provideRouter(routes), provideClientHydration()]
//};


import { ApplicationConfig, Injectable, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch, withJsonpSupport } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withJsonpSupport()
    ),
  ]
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
  constructor(private http: HttpClient) {
    // This service can now make HTTP requests via `this.http`.
  }

}
