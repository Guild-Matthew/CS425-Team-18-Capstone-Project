//Mary Cottier, Shane Petree, Guilherme Cassiano
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-claimed-items',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './claimed-items.component.html',
  styleUrls: ['./claimed-items.component.css'],
})
export class ClaimedItemsComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  building: string = '';
  selectedFloor: string = '';
  selectedRoom: string = '';
  items: any[] = [];
  buildings: string[] = [];
  floors: string[] = [];
  rooms: string[] = [];
  authToken: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.building = params['building'] || '';
      this.fetchItems();
    });
    this.authToken = localStorage.getItem('authtoken');
  }

  fetchItems(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const url = `${flask_URL}/claimedItems?token=${authToken}&user_id=${userId}&role=${role}&building=${this.building}&filterType=${this.filterType}&sort=${this.sortOrder}&floor=${this.selectedFloor}&room=${this.selectedRoom}`;

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      data => {
        this.items = data.items;
        this.buildings = data.buildings;
        this.floors = data.floors || [];
        this.rooms = data.rooms || [];
      },
      error => console.error("Error fetching items:", error)
    );
  }

  onSortChange(event: any): void {
    this.sortOrder = event.target.value;
    this.fetchItems();
  }

  onFilterChange(event: any): void {
    this.filterType = event.target.value;
    this.fetchItems();
  }

  onFloorChange(): void {
    this.selectedRoom = '';
    this.fetchItems();
  }

  onRoomChange(): void {
    this.fetchItems();
  }
}


