//Mary Cottier, Matthew Guild, Shane Petree
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { LoginComponent } from './pages/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="showToast()">Show Toast</button>
    <div *ngFor="let toast of toastService.toasts; let i = index">
      {{ toast }}
      <button (click)="removeToast(i)">X</button>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, MapComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  title = 'AnguarFrontend';
  constructor(public toastService: ToastService) {}

  showToast() {
    this.toastService.add('This is a toast message.');
  }

  removeToast(index: number) {
    this.toastService.remove(index);
  }
  ngOnInit(): void {
    localStorage.clear();
  }

  // clears the local storage when the browser is closed
  @HostListener("window:beforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
  }
}
