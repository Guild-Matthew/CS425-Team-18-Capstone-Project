import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  role: string | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.role = localStorage.getItem('role');  

    if (this.role !== 'student') {
      console.error("User is not a student. Redirecting to login.");
      this.router.navigate(['/login']);
    } else {
      console.log(`User is logged in as: ${this.role}`);
    }
  }

  //logout() {
  //  localStorage.clear();
  //  alert('Your session has been closed');
  //  this.router.navigate(['/map']);
  //}
}
