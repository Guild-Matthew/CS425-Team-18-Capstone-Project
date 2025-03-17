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
  items: any[] = [];
  buildings: string[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.building = params['building'] || '';
      this.fetchItems();
    });
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

    const url = `${flask_URL}/claimedItems?user_id=${userId}&role=${role}&building=${this.building}&filterType=${this.filterType}&sort=${this.sortOrder}`;

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
  onSortChange(event: any): void {
    this.sortOrder = event.target.value;
    this.fetchItems();
  }

  onFilterChange(event: any): void {
    this.filterType = event.target.value;
    this.fetchItems();
  }
 }

