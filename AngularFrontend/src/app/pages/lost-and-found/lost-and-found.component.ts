// Mary Cottier, Shane Petree, Guilherme Cassiano, Matthew Guild

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';

interface Item {
  id: number;
  type: string;
  subcategory: string;
  location: string;
  dateFound: string;
  description: string;
  roomNumber?: string;
  floorNumber?: string;
  claimed?: boolean;
}

@Component({
  selector: 'app-lost-and-found',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule, NavBarComponent],
  templateUrl: './lost-and-found.component.html',
  styleUrls: ['./lost-and-found.component.css']
})
export class LostAndFoundComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  items: Item[] = [];
  filteredItems: Item[] = [];
  selectedBuilding: string = '';
  selectedFloor: string = '';
  selectedRoom: string = '';
  buildings: string[] = [];
  floors: string[] = [];
  rooms: string[] = [];
  errorMessage: string = '';
  closestSuggestedBuilding: string = '';
  role: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.route.queryParams.subscribe(params => {
      this.selectedBuilding = params['building'] || '';
      this.fetchItems();
    });
  }

  checkLoginStatus(): void {
    this.role = localStorage.getItem('role');
    if (!this.role || !['student', 'admin', 'superadmin'].includes(this.role)) {
      console.log(`User is logged in as: ${this.role}`);
    }
  }

  fetchItems(): void {
    this.errorMessage = '';
    const url = `${flask_URL}/L&F?building=${this.selectedBuilding}&filterType=${this.filterType}&sort=${this.sortOrder}&floor=${this.selectedFloor}&room=${this.selectedRoom}`;

    this.http.get<any>(url).subscribe(
      data => {
        this.items = data.items.map((item: any) => ({
          id: item.id,
          type: item[0],
          subcategory: item[1],
          location: item[2],
          description: item[3],
          dateFound: item[4],
          roomNumber: item[5],
          floorNumber: item[6],
          claimed: item.claimed || false
        }));
        this.buildings = data.buildings;
        this.floors = data.floors || [];
        this.rooms = data.rooms || [];
        this.selectedBuilding = data.selected_building;
        this.applyFilters();
      },
      error => {
        if (
          error.status === 400 &&
          error.error?.warning &&
          error.error?.buildings &&
          error.error?.closest_building
        ) {
          this.errorMessage = `Building "${this.selectedBuilding}" has no lost and found. Closest available building is "${error.error.closest_building}". Please select it OR JCSU from the dropdown.`;
          this.buildings = error.error.buildings;
          this.closestSuggestedBuilding = error.error.closest_building;
        } else {
          this.errorMessage = 'An error occurred while fetching items.';
        }
        this.items = [];
        this.filteredItems = [];
      }
    );
  }

  onBuildingChange(): void {
    this.errorMessage = '';
    this.selectedFloor = '';
    this.selectedRoom = '';
    this.fetchItems();
  }

  onFloorChange(): void {
    this.selectedRoom = '';
    this.fetchItems();
  }

  onSortChange(event: Event): void {
    this.sortOrder = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onFilterChange(event: Event): void {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onRoomChange(): void {
    this.fetchItems();
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter(item =>
      this.filterType === 'all' || item.type.toLowerCase() === this.filterType
    );

    this.filteredItems.sort((a, b) =>
      this.sortOrder === 'newest'
        ? new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime()
        : new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime()
    );
  }

  trackByFn(index: number, item: Item): any {
    return item.type + item.dateFound + index;
  }

  markAsClaimed(item: Item): void {
    if (item.claimed) return;

    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId || !authToken) {
      console.error("User not authenticated");
      return;
    }

    const dateClaimed = new Date().toISOString().split('T')[0];
    console.log("floor:", this.selectedFloor)
    console.log("room:", this.selectedRoom)
    const url = `${flask_URL}/remove_item`;
    const body = {
      user_id: userId,
      role: role,
      authtoken: authToken,
      itemType: item.type,
      locationFound: item.location,
      dateFound: item.dateFound,
      description: item.description,
      lfLocation: this.selectedBuilding,
      floor: item.floorNumber,
      room: item.roomNumber,
      subcategory: item.subcategory
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http.post(url, body, { headers, withCredentials: true }).subscribe({
      next: () => {
        console.log(`Item "${item.description}" marked as claimed.`);
        alert('Item marked as claimed.');
        item.claimed = true;
        this.items = this.items.filter(i =>
          !(i.type === item.type &&
            i.location === item.location &&
            i.description === item.description &&
            i.dateFound === item.dateFound)
        );
        this.applyFilters();
      },
      error: error => {
        console.error('Error marking item as claimed:', error);
      }
    });
  }
}
