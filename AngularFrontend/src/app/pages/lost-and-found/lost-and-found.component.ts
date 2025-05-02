// Mary Cottier, Shane Petree, Guilherme Cassiano, Matthew Guild

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { ToastService } from '../../toast.service';

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
  userid: string | null = null;
  selectedSubtype: string = 'all';
  buildingpermissions: string[] = [];
  subtypes: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 4;
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
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, public toastService: ToastService) { }

  ngOnInit(): void {
    this.checkLoginStatus();
    this.route.queryParams.subscribe(params => {
      this.selectedBuilding = params['building'] || '';
      this.fetchItems();
    });
  }

  checkPermissions(): boolean {
    for (const buildingCheck of this.buildingpermissions) {
      if (buildingCheck === this.selectedBuilding) {
        return true;
      }
    }
    return false;
  }

  checkLoginStatus(): void {
    this.role = localStorage.getItem('role');
    this.userid = localStorage.getItem('user_id');
    if (!this.role || !['student', 'admin', 'superadmin'].includes(this.role)) {
      console.log(`User is logged in as: ${this.role}`);
    }
  }

  fetchItems(): void {
    this.currentPage = 1;
    this.errorMessage = '';
    const url = `${flask_URL}/L&F?building=${encodeURIComponent(this.selectedBuilding)}&filterType=${encodeURIComponent(this.filterType)}&subtype=${encodeURIComponent(this.selectedSubtype)}&sort=${encodeURIComponent(this.sortOrder)}&floor=${encodeURIComponent(this.selectedFloor)}&room=${encodeURIComponent(this.selectedRoom)}&user_id=${encodeURIComponent(this.userid)}`;


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
        this.buildingpermissions = data.accessbuildings || [];
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
    this.currentPage = 1;
    this.sortOrder = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onFilterChange(event: Event): void {
    this.currentPage = 1;
    this.filterType = (event.target as HTMLSelectElement).value;
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

  onSubtypeChange(): void {
    this.currentPage = 1;
    this.fetchItems();
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
        this.toastService.add('Item marked as claimed.', 3000, 'success');
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
  get paginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredItems.length / this.itemsPerPage);
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
