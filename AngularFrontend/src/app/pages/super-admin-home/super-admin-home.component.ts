//Mary Cottier, Guilherme Cassiano
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-super-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './super-admin-home.component.html',
  styleUrls: ['./super-admin-home.component.css']
})
export class SuperAdminHomeComponent {
  role: string | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.role = localStorage.getItem('role');

    if (this.role !== 'superadmin') {
      console.error("User is not a superadmin. Redirecting to login.");
      this.router.navigate(['/login']);
    } else {
      console.log(`User is logged in as: ${this.role}`);
    }
  }
}
