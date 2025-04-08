import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-deactivateuser',
  standalone: true,
  templateUrl: './deactivateuser.component.html',
  styleUrls: ['./deactivateuser.component.css'],
  imports: [CommonModule, RouterModule]
})
export class DeactivateUserComponent {
  // Simulate current user role (can be 'student' or 'staff')
  role: string = 'student';

  users = [
    { id: 1, name: 'Alice', email: 'alice@unr.edu', role: 'student', building: 'SEM' },
    { id: 2, name: 'Bob', email: 'bob@unr.edu', role: 'staff', building: 'DMSC' },
    { id: 3, name: 'Charlie', email: 'charlie@unr.edu', role: 'student', building: 'AB' },
    { id: 4, name: 'Diana', email: 'diana@unr.edu', role: 'staff', building: 'SEM' }
  ];

  filterType: string = 'all';

  filterAccounts(type: string) {
    this.filterType = type;
  }

  deactivateUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
    alert(`User with ID ${userId} has been deactivated.`);
  }

  get filteredUsers() {
    if (this.filterType === 'all') return this.users;
    return this.users.filter(user => user.building === this.filterType);
  }
}
