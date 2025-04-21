import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'edit-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgSelectModule],
  templateUrl: './edit-permissions.component.html',
  styleUrls: ['./edit-permissions.component.css']
})
export class EditPermissionsComponent implements OnInit {
  users: any[] = [];
  allBuildings: string[] = [];
  userBuildings: Set<string> = new Set();

  selectedUserId: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    if (!userId || !role) {
      console.warn('Missing credentials for fetching buildings');
      return;
    }

    this.fetchUsers();

    setTimeout(() => {
      this.fetchAllBuildings(userId, role);
    }, 300);
  }

  fetchUsers(): void {
    const role = localStorage.getItem('role') || '';
    const params = new HttpParams()
      .set('type', 'users')
      .set('role', role); 
    this.http.get<any>(`${flask_URL}/update_user_permissions`, { params }).subscribe(
      res => {
        this.users = res.users || [];
      },
      err => {
        console.error('Error fetching users:', err);
      }
    );
  }

  fetchAllBuildings(userId: string, role: string, attempt: number = 1): void {
    const params = new HttpParams()
      .set('type', 'buildings')
      .set('user_id', userId)
      .set('role', role);

    this.http.get<any>(`${flask_URL}/update_user_permissions`, { params }).subscribe(
      res => {
        this.allBuildings = res.buildings || [];
      },
      err => {
        console.error(`Error fetching buildings (attempt ${attempt}):`, err);
        if (attempt < 3) {
          setTimeout(() => this.fetchAllBuildings(userId, role, attempt + 1), 300);
        }
      }
    );
  }

  loadUserPermissions(): void {
    this.userBuildings.clear();
    const params = new HttpParams()
      .set('type', 'permissions')
      .set('uid', this.selectedUserId);

    this.http.get<any>(`${flask_URL}/update_user_permissions`, { params }).subscribe(
      res => {
        (res.buildings || []).forEach((b: string) => this.userBuildings.add(b));
      },
      err => {
        console.error('Error loading user permissions:', err);
      }
    );
  }

  toggleBuilding(building: string, event: any): void {
    const checked = event.target.checked;
    if (checked) {
      this.userBuildings.add(building);
    } else {
      this.userBuildings.delete(building);
    }
  }

  submitPermissions(): void {
    const authtoken = localStorage.getItem('authtoken');
    const user_id = localStorage.getItem('user_id');

    const body = {
      user_id,
      authtoken,
      target_id: this.selectedUserId,
      buildings: Array.from(this.userBuildings)
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(`${flask_URL}/update_user_permissions`, body, { headers }).subscribe(
      () => {
        alert('Permissions updated successfully!');
        this.selectedUserId = '';
        this.userBuildings.clear();

        if (user_id && localStorage.getItem('role')) {
          this.fetchUsers();
          this.fetchAllBuildings(user_id, localStorage.getItem('role')!);
        }
      },
      err => {
        console.error('Error updating permissions:', err);
        alert('Failed to update permissions.');
      }
    );
  }

  getUserDisplayName(): string {
    const user = this.users.find(u => u.id === this.selectedUserId);
    return user ? `${user.name} (${user.email})` : '';
  }

  trackByBuilding(index: number, building: string): string {
    return building;
  }

}
