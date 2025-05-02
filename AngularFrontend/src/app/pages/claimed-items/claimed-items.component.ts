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
  subtypes: string[] = [];
  selectedSubtype: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  subcategories: { [key: string]: string[] } = {
    clothing: [
      'Jackets & Coats', 'Hoodies & Sweatshirts', 'Shirts & Blouses',
      'Pants & Shorts', 'Hats & Beanies', 'Scarves & Gloves',
      'Footwear', 'Uniforms', 'Other Clothing Items'
    ],
    technology: [
      'Phones', 'Laptops & Tablets', 'Headphones & Earbuds',
      'Chargers & Cables', 'Calculators', 'USB Drives',
      'Smartwatches & Wearables', 'Cameras', 'Other Electronics'
    ],
    medical_health: [
      'Prescription Medications', 'Inhalers', 'Glasses & Contacts',
      'First Aid Items', 'Medical Devices', 'Hand Sanitizer',
      'Toiletry Bag', 'Other Health Items'
    ],
    bags: [
      'Backpacks', 'Purses', 'Tote Bags', 'Laptop Bags',
      'Gym Bags', 'Lunch Bags', 'Wallets', 'Other Bags'
    ],
    school: [
      'Notebooks', 'Textbooks', 'Binders & Folders', 'Pens & Pencils',
      'Index Cards', 'Art Supplies', 'Stationery Sets', 'Other School Supplies'
    ],
    sports_rec: [
      'Water Bottles', 'Balls', 'Rackets & Bats', 'Protective Gear',
      'Workout Equipment', 'Fitness Trackers', 'Skateboards/Scooters', 'Other Recreational Items'
    ],
    Keys_IDs: [
      'House Keys', 'Car Keys', 'Student ID', 'Driver’s License',
      'Credit/Debit Cards', 'Keychains', 'Fobs or Access Cards', 'Other IDs or Keys'
    ],
    miscellaneous: [
      'Jewelry', 'Sunglasses', 'Books & Novels', 'Toys & Games',
      'Umbrellas', 'Tools', 'Earplugs', 'Misc. Personal Items'
    ]
  };

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
    this.currentPage = 1;
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const url = `${flask_URL}/claimedItems?token=${encodeURIComponent(authToken)}&user_id=${encodeURIComponent(userId)}&role=${encodeURIComponent(role)}&building=${encodeURIComponent(this.building)}&filterType=${encodeURIComponent(this.filterType)}&sort=${encodeURIComponent(this.sortOrder)}&floor=${encodeURIComponent(this.selectedFloor)}&room=${encodeURIComponent(this.selectedRoom)}&subtype=${encodeURIComponent(this.selectedSubtype)}`;
    this.http.get<any>(url, { withCredentials: true }).subscribe(
      data => {
        this.items = data.items;
        this.buildings = data.buildings;
        this.floors = data.floors || [];
        this.rooms = data.rooms || [];
        this.currentPage = 1;
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
    this.selectedSubtype = 'all';
    this.fetchSubtypes();
    this.fetchItems();
  }

  fetchSubtypes(): void {
    if (this.filterType === 'all') {
      this.subtypes = [];
    } else {
      this.subtypes = this.subcategories[this.filterType] || [];
    }
  }

  onSubtypeChange(): void {
    this.fetchItems();
  }

  onFloorChange(): void {
    this.selectedRoom = '';
    this.fetchItems();
  }

  onRoomChange(): void {
    this.fetchItems();
  }
  get paginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.items.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}


