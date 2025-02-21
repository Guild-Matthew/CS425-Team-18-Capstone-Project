import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-claimed-items',
  templateUrl: './claimed-items.component.html',
  styleUrls: ['./claimed-items.component.css']
})
export class ClaimedItemsComponent implements OnInit {
  building: string = 'Default Building';
  sortOrder: string = 'newest';
  filterType: string = 'all';
  items: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    // Mock data for testing
    this.items = [
      { type: 'Clothing', location: 'Library', dateFound: '2025-01-10', dateClaimed: '2025-01-15', description: 'Blue Jacket' },
      { type: 'Technology', location: 'Cafeteria', dateFound: '2025-02-01', dateClaimed: '2025-02-10', description: 'Laptop Charger' },
      { type: 'Miscellaneous', location: 'Gym', dateFound: '2025-03-05', dateClaimed: '2025-03-07', description: 'Water Bottle' }
    ];
  }

  sortItems(event: Event): void {
    this.sortOrder = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  filterItems(event: Event): void {
    this.filterType = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters(): void {
    let url = `/claimedItems?filterType=${this.filterType}&sort=${this.sortOrder}&building=${this.building}`;
    this.router.navigateByUrl(url);
  }
}
