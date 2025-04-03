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

<<<<<<< HEAD
  logout() {
    localStorage.removeItem('role');  
    localStorage.removeItem('user_id');  
    this.router.navigate(['/login']);
  }
=======
  //logout() {
  //  localStorage.clear();
  //  alert('Your session has been closed');
  //  this.router.navigate(['/map']);
  //}
>>>>>>> e67f265 (Created a logout component and replaced logout method.)
}
