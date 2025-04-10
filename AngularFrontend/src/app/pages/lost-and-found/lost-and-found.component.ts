//Mary Cottier, Shane Petree, Guilherme Cassiano, Matthew Guild

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Define structure of a Lost & Found item
interface Item {
  type: string;
  location: string;
  dateFound: string;
  description: string;
  imageUrl?: string;
  imageVisible: boolean;
}

@Component({
  selector: 'app-lost-and-found',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],  // Shane Petree
  templateUrl: './lost-and-found.component.html',
  styleUrls: ['./lost-and-found.component.css']
})
export class LostAndFoundComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  items: any[] = [];
  filteredItems: any[] = [];
  selectedBuilding: string = '';
  buildings: string[] = [];
  errorMessage: string = '';
  closestBuilding: string = '';
  closestSuggestedBuilding: string = ''; 
  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  };

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    this.errorMessage = '';
    const url = `${flask_URL}/L&F?building=${this.selectedBuilding}&filterType=${this.filterType}&sort=${this.sortOrder}`;
      console.error("Building name is missing");
    this.http.get<any>(url).subscribe(
      data => {
        this.items = data.items.map(item => ({

    this.http.get<any[]>(url).subscribe(
      (data) => {  
        this.items = data.map(item => ({

    this.http.get<any[]>(url).subscribe(
      (data) => {  
        this.items = data.map(item => ({
          imageUrl: item[4]  
          location: item[1],
          description: item[2],
          dateFound: item[3],
          imageUrl: item[4]  
        }));
        this.buildings = data.buildings;
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
          this.errorMessage = `Building "${this.selectedBuilding}" has no lost and found. Closest available building is "${error.error.closest_building}". Please select it OR JCSU from the dropdown. `;

          this.buildings = error.error.buildings;

          this.closestSuggestedBuilding = error.error.closest_building;
        } else {
          this.errorMessage = 'An error occurred while fetching items.';
  onBuildingChange(): void {
    this.errorMessage = '';
    this.fetchItems();
    this.filteredItems.sort((a, b) => this.sortOrder === 'newest'
      ? new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime()
      : new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime()
    );
    this.filteredItems.sort((a, b) => this.sortOrder === 'newest'
      ? new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime()
      : new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime()
    );
  }

  onSortChange(event: Event): void {
    this.sortOrder = (event.target as HTMLSelectElement).value;
  applyFilters(): void {
    this.filteredItems = this.items.filter(item =>
      this.filterType === 'all' || item.type.toLowerCase() === this.filterType
    );

    this.filteredItems.sort((a, b) => this.sortOrder === 'newest'
      ? new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime()
      : new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime()
    );
  }

  toggleImage(item: any): void {
  }

  onFilterChange(event: Event): void {
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;  
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;  
  }
}

