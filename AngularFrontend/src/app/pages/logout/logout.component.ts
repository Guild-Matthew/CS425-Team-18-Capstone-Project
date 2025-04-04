// Shane Petree
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: '',
})
export class LogoutComponent implements OnInit{
  constructor(private router: Router) { }

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    localStorage.clear();
    alert('Your session has been closed');
    this.router.navigate(['/map']);
  }
}
