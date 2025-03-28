import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-deactivateUser',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './deactivateuser.component.html',
  styleUrl: './deactivateuser.component.css'
})
export class DeactivateUserComponent implements OnInit {
  users: any[] = [];
  role: string = ''; // Added role property

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUserRole(); // Get the user role
    this.loadUsers();
  }

  getUserRole(): void {
    // Example: Fetch from local storage or API
    this.role = localStorage.getItem('userRole') || 'student'; // Default role: student
  }

  loadUsers(): void {
    this.http.get<any[]>('/api/users').subscribe(data => {
      this.users = data;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  filterAccounts(selectedFilter: string): void {
    const url = selectedFilter === 'all' ? '/api/users' : `/api/users?building=${selectedFilter}`;
    this.http.get<any[]>(url).subscribe(data => {
      this.users = data;
    }, error => {
      console.error('Error filtering users:', error);
    });
  }

  deactivateUser(userId: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.http.post(`/api/deactivate/${userId}`, {}).subscribe(response => {
        alert('User deactivated successfully');
        this.loadUsers();
      }, error => {
        console.error('Error deactivating user:', error);
        alert('Failed to deactivate user');
      });
    }
  }

  logout(): void {
    console.log('User logged out');
    localStorage.removeItem('userRole'); // Clears role when logging out
  }
}
