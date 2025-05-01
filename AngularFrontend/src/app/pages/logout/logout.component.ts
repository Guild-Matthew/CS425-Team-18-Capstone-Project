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
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.logout();
  }

  logout(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');

    // Clear local storage/session data
    localStorage.clear();

    this.router.navigate(['/map']);
  }
}
