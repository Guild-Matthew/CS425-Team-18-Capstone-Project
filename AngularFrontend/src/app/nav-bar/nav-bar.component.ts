import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isLoggedIn: boolean = false;
  role: string | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.role = localStorage.getItem('role');

    if (this.role !== 'student' && this.role !== 'admin' && this.role !== 'superadmin') {
      //console.error("User is not authorized. Redirecting to login.");
      this.isLoggedIn = false;
      //this.router.navigate(['/login']);
    } else {
      this.isLoggedIn = true;
      console.log(`User is logged in as: ${this.role}`);
    }
  }
}
