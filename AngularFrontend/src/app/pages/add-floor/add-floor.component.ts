import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'add-floor',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.css']
})
export class AddFloorComponent implements OnInit {
  items: any[] = [];
  buildings: string[] = [];
  authToken: string | null = null;
  selectedBuilding: string = '';
  floors: string[] = [];
  newFloorNumber: number | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedBuilding = params['selected_building'] || '';
      this.fetchItems();
    });
    this.authToken = localStorage.getItem('authtoken');
  }

  fetchItems(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedBuilding) {
      this.selectedBuilding = "Please select a building";
    }

    const url = `${flask_URL}/editBuilding?token=${authToken}&user_id=${userId}&role=${role}&selected_building=${this.selectedBuilding}`;

    console.log("Fetching items from:", url);

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      data => {
        console.log("Data received:", data);
        this.items = data.items;
        this.buildings = data.buildings;
        this.floors = data.floors;
        this.selectedBuilding = data.selected_building;
      },
      error => console.error("Error fetching items:", error)
    );
  }

  addFloor(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId || !authToken || !this.selectedBuilding || this.newFloorNumber === null) {
      console.error("Missing required data");
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role || '');
    formData.append('token', authToken);
    formData.append('action', 'add_floor');
    formData.append('floorNumber', this.newFloorNumber.toString());
    formData.append('selected_building', this.selectedBuilding);

    this.http.post(`${flask_URL}/editBuilding`, formData, { withCredentials: true }).subscribe(
      response => {
        console.log("Floor added successfully", response);
        this.newFloorNumber = null;
        this.fetchItems();
      },
      error => {
        console.error("Error adding floor:", error);
      }
    );
  }

  removeFloor(floor: string): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId || !authToken || !this.selectedBuilding) {
      console.error("Missing required data for removal");
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role || '');
    formData.append('token', authToken);
    formData.append('action', 'remove_floor');
    formData.append('floor_number', floor);
    formData.append('selected_building', this.selectedBuilding);

    this.http.post(`${flask_URL}/editBuilding`, formData, { withCredentials: true }).subscribe(
      response => {
        console.log(`Floor ${floor} removed successfully`, response);
        this.fetchItems();
      },
      error => {
        console.error("Error removing floor:", error);
      }
    );
  }
}
