//Mary Cottier, Shane Petree, Guilherme Cassiano, Matthew Guild

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { HttpClientModule } from '@angular/common/http';

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
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './lost-and-found.component.html',
  styleUrls: ['./lost-and-found.component.css']
})
export class LostAndFoundComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  building: string = '';
  items: Item[] = [];
  filteredItems: Item[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.building = params['building'] || 'Unknown';
      this.fetchItems();
    });
  }

  fetchItems(): void {
    if (!this.building) {
      console.error('Building name is missing');
      return;
    }

    const url = `${flask_URL}/L&F?building=${this.building}&filterType=${this.filterType}&sort=${this.sortOrder}`;
    console.log('Fetching from URL:', url);

    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.items = data.map(item => ({
          type: item[0],
          location: item[1],
          description: item[2],
          dateFound: item[3],
          imageUrl: item[4],
          imageVisible: false
        }));
        this.applyFilters();
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );
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

  onSortChange(event: Event): void {
    this.sortOrder = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onFilterChange(event: Event): void {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  toggleImage(item: Item): void {
    item.imageVisible = !item.imageVisible;
  }

  trackByFn(index: number, item: Item): any {
    return item.dateFound + item.type + item.location || index;
  }
}

