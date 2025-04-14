//Guilherme Cassiano
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'remove-item',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './remove-item.component.html',
  styleUrls: ['./remove-item.component.css']
})
export class RemoveItemComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  building: string = '';
  floors: string[] = [];
  rooms: string[] = []; 
  items: any[] = [];
  buildings: string[] = [];
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

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.building) {
      this.building = "Please select a building";
    }

    const url = `${flask_URL}/remove_item?user_id=${userId}&role=${role}&building=${this.building}&filterType=${this.filterType}&sort=${this.sortOrder}`;

    console.log("Fetching items from:", url);

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      data => {
        console.log("Data received:", data);
        this.items = data.items;
        this.buildings = data.buildings;
      },
      error => console.error("Error fetching items:", error)
    );
  }

  removeItem(item: any): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');
    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${item.type}"?`)) return;

    const url = `${flask_URL}/remove_item`;

    const body = {
      user_id: userId,  
      role: role,
      authtoken: authToken,
      itemType: item.type,
      locationFound: item.location,
      dateFound: item.dateFound,
      description: item.description,
      lfLocation: item.lfLocation
    };

    const headers = { 'Content-Type': 'application/json' };

    this.http.post(url, body, { headers, withCredentials: true }).subscribe(
      response => {
        console.log("Item removed successfully", response);
        alert('Item marked as claimed');
        this.items = this.items.filter(i => i !== item);
        this.fetchItems();
      },
      error => console.error("Error removing item:", error)
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
}
