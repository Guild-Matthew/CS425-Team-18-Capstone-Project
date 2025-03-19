//Mary Cottier
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent {
  role: string | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.role = localStorage.getItem('role');

    if (this.role !== 'admin') {
      console.error("User is not a admin. Redirecting to login.");
      this.router.navigate(['/login']);
    } else {
      console.log(`User is logged in as: ${this.role}`);
    }
  }

  logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }
}
