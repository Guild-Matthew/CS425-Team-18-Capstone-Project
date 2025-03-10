// Shane Petree

import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
//import { ConfigService } from './app.config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'Frontend';

  //// create a http client
  //private http = inject(HttpClient);

  //async getMaps() {
  //  this.http.get("https://maps.googleapis.com/maps/api/js?key=AIzaSyDpJ6Oa8-l0r8Pf16RjCsgDUbsvOPotAGU&callback=initMap");
  //  return this.http;
  //}
  //request() {
  //  return this.http.request();
  //}

  //googleMaps = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDpJ6Oa8-l0r8Pf16RjCsgDUbsvOPotAGU&callback=initMap";
  //http.get<json>()
  //function getMap(): JSON{

  //}
}
