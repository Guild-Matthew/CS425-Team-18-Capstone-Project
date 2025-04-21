//Guilherme Cassiano, Mary Cottier 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { flask_URL } from '../../app.config';

@Component({
  selector: 'app-deactivateuser',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './deactivateuser.component.html',
  styleUrls: ['./deactivateuser.component.css']
})
export class DeactivateUserComponent implements OnInit {
  users: any[] = [];
  deactivatedUsers: any[] = [];
  accessibleBuildings: string[] = [];
  selectedBuildings: Set<string> = new Set();
  role: string = 'student';
  accountFilter: string = 'active';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    const params = new HttpParams()
      .set('user_id', userId || '')
      .set('role', role || '')
      .set('building', 'all');

    this.http.get<any>(`${flask_URL}/deactivate_user`, { params }).subscribe(
      response => {
        this.users = response.users;
        this.deactivatedUsers = response.usersActivate || [];
        this.accessibleBuildings = response.buildings;
        this.selectedBuildings = new Set(response.buildings);
      },
      error => {
        console.error('Failed to load users:', error);
      }
    );
  }

  onBuildingCheckboxChange(event: any): void {
    const building = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      this.selectedBuildings.add(building);
    } else {
      this.selectedBuildings.delete(building);
    }

    this.filterUsersByBuildings(); 
  }

  toggleSelectAll(event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.accessibleBuildings.forEach(b => this.selectedBuildings.add(b));
    } else {
      this.selectedBuildings.clear();
    }

    this.filterUsersByBuildings();
  }

  deactivateUser(userId: number): void {
    const user_id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('authtoken');

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      user_id,
      role,
      authtoken: token,
      target_id: userId
    };

    this.http.post(`${flask_URL}/deactivate_user`, body, { headers }).subscribe(
      () => {
        const deactivatedUser = this.users.find(user => user.id === userId);
        if (deactivatedUser) {
          this.users = this.users.filter(user => user.id !== userId);
          this.deactivatedUsers.push(deactivatedUser); 
        }
        alert(`User with ID ${userId} has been deactivated.`);
      },
      error => {
        console.error('Error deactivating user:', error);
      }
    );
  }

  get filteredUsers(): any[] {
    if (this.selectedBuildings.size === 0) {
      return this.users;
    }
    return this.users.filter(user =>
      user.buildings.some((b: string) => this.selectedBuildings.has(b))
    );
  }
  get filteredDeactivatedUsers(): any[] {
    if (this.selectedBuildings.size === 0) {
      return this.deactivatedUsers;
    }
    return this.deactivatedUsers.filter(user =>
      user.buildings.some((b: string) => this.selectedBuildings.has(b))
    );
  }

  filterUsersByBuildings(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    let params = new HttpParams()
      .set('user_id', userId || '')
      .set('role', role || '');

    this.selectedBuildings.forEach(building => {
      params = params.append('building', building);
    });

    this.http.get<any>(`${flask_URL}/deactivate_user`, { params }).subscribe(
      response => {
        this.users = response.users;
        this.deactivatedUsers = response.deactivatedUsers || [];
      },
      error => {
        console.error('Error fetching filtered users:', error);
      }
    );
  }

  reactivateUser(userId: number): void {
    const user_id = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('authtoken');

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      user_id,
      role,
      authtoken: token,
      target_id: userId,
      reactivate: true
    };

    this.http.post(`${flask_URL}/deactivate_user`, body, { headers }).subscribe(
      () => {
        const reactivatedUser = this.deactivatedUsers.find(user => user.id === userId);
        if (reactivatedUser) {
          this.deactivatedUsers = this.deactivatedUsers.filter(user => user.id !== userId);
          this.users.push(reactivatedUser);
        }
        alert(`User with ID ${userId} has been reactivated.`);
      },
      error => {
        console.error('Error reactivating user:', error);
      }
    );
  }

}
