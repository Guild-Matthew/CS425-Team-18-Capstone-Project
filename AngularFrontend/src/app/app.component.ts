//Mary Cottier, Matthew Guild, Shane Petree
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  //template: `<app-login></app-login>`,
  standalone: true,
  imports: [CommonModule, RouterModule, MapComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'AnguarFrontend';
}
