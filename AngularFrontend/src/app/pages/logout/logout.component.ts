// Shane Petree
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  template: '',
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');

    // Clear local storage/session data
    localStorage.clear();

    // Show custom message based on logout reason
    if (reason === 'timeout') {
      alert('Your session has timed out due to inactivity. Please log in again.');
    } else {
      alert('Your session has been closed.');
    }

    this.router.navigate(['/map']);
  }
}
