// Mary Cottier, Shane Petree, Guilherme Cassiano, Matthew Guild

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Define structure of a Lost & Found item
interface Item {
  id: number;
  type: string;
  location: string;
  dateFound: string;
  description: string;
  imageUrl?: string;
  imageVisible: boolean;
  claimed?: boolean; // Add claimed status to item structure
}

@Component({
  selector: 'app-lost-and-found',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './lost-and-found.component.html',
  styleUrls: ['./lost-and-found.component.css']
})
export class LostAndFoundComponent implements OnInit {
  sortOrder: string = 'oldest';
  filterType: string = 'all';
  items: Item[] = [];
  filteredItems: Item[] = [];
  selectedBuilding: string = '';
  buildings: string[] = [];
  errorMessage: string = '';
  closestSuggestedBuilding: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedBuilding = params['building'] || '';
      this.fetchItems();
    });
  }

  fetchItems(): void {
    this.errorMessage = '';
    const url = `${flask_URL}/L&F?building=${this.selectedBuilding}&filterType=${this.filterType}&sort=${this.sortOrder}`;

    this.http.get<any>(url).subscribe(
      data => {
        this.items = data.items.map((item: any) => ({
          id: item.id,
          type: item[0],
          location: item[1],
          description: item[2],
          dateFound: item[3],
          imageUrl: item[4],
          imageVisible: false,
          claimed: item.claimed || false // Assuming 'claimed' status is included in the response
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

  toggleImage(item: Item): void {
    item.imageVisible = !item.imageVisible;
  }

  trackByFn(index: number, item: Item): any {
    return item.type + item.dateFound + index; // fallback tracking
  }

  markAsClaimed(item: Item): void {
    if (item.claimed) {
      return;
    }
  
    const dateClaimed = new Date().toISOString().split('T')[0]; // format as YYYY-MM-DD
    const body = {
      itemType: item.type,
      LocationFound: item.location,
      itemDescription: item.description,
      dateFound: item.dateFound,
      dateClaimed: dateClaimed,
      LFlocation: this.selectedBuilding
    };
  
    const url = `${flask_URL}/L&F/claimItem`;
    this.http.post<any>(url, body).subscribe({
      next: (response) => {
        console.log(`Item "${item.description}" marked as claimed.`);
        item.claimed = true;
        this.items = this.items.filter(i =>
          !(i.type === item.type &&
            i.location === item.location &&
            i.description === item.description &&
            i.dateFound === item.dateFound)
        );
        this.applyFilters(); // Refresh filtered view
      },
      error: (error) => {
        console.error('Error marking item as claimed:', error);
        // Optionally: Show user-facing error or undo `item.claimed = true`
      }
    });
  }  
}
