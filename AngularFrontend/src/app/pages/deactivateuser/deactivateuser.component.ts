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
  role: string = 'student'; // Simulate current user role

  users = [
    { id: 1, name: 'Alice', email: 'alice@unr.edu', role: 'student', building: 'SEM' },
    { id: 2, name: 'Bob', email: 'bob@unr.edu', role: 'staff', building: 'DMSC' },
    { id: 3, name: 'Charlie', email: 'charlie@unr.edu', role: 'student', building: 'AB' },
    { id: 4, name: 'Diana', email: 'diana@unr.edu', role: 'staff', building: 'SEM' }
  ];

  // Simulated user-accessible buildings
  accessibleBuildings: string[] = ['SEM', 'DMSC', 'AB']; // Customize per user
  selectedBuildings: Set<string> = new Set();

  ngOnInit(): void {
    // By default, all buildings accessible to the user are selected
    this.accessibleBuildings.forEach(b => this.selectedBuildings.add(b));
  }

  onBuildingCheckboxChange(event: any): void {
    const building = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      this.selectedBuildings.add(building);
    } else {
      this.selectedBuildings.delete(building);
    }
  }

  // Handle "Select All" checkbox
  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.accessibleBuildings.forEach(building => this.selectedBuildings.add(building));
    } else {
      this.selectedBuildings.clear();
    }
  }

  deactivateUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
    alert(`User with ID ${userId} has been deactivated.`);
  }

  // Filter users based on selected buildings
  get filteredUsers() {
    if (this.selectedBuildings.size === 0) {
      return this.users; // Show all users if no buildings are selected
    }
    return this.users.filter(user =>
      this.selectedBuildings.has(user.building)
    );
  }
}
