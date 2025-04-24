//Mary Cottier, Shane Petree, Guilherme Cassiano, Matthew Guild
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgFor]
})
export class AddItemComponent implements OnInit {
  item: any = {
    worker: '',
    location: '',
    floor: '',
    room: '',
    dateFound: '',
    locationFound: '',
    itemType: '',
    subcategory: '',
    description: '',
  };
  
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
  
  authToken: string | null = null;
  buildings: string[] = [];
  floors: string[] = [];
  rooms: string[] = []; 
  selectedBuilding: string = '';
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('authtoken');
    this.fetchBuildings();
  }

  fetchBuildings(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    if (!userId) {
      console.error('No user ID found. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    const url = `${flask_URL}/Items?user_id=${userId}&role=${role}`;
    this.http.get<any>(url, { withCredentials: true }).subscribe({
      next: data => {
        console.log('Buildings received:', data.buildings);
        this.buildings = data.buildings;
      },
      error: err => {
        console.error('Error fetching buildings:', err);
      }
    });
  }

  fetchFloors(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    if (!this.item.location) return;
  
    const url = `${flask_URL}/editFloor?token=${this.authToken}&user_id=${userId}&role=${role}&selected_building=${this.item.location}`;
  
    this.http.get<any>(url, { withCredentials: true }).subscribe({
      next: data => {
        this.floors = data.floors || [];
        this.rooms = [];
        this.item.floor = '';
        this.item.room = '';
      },
      error: err => {
        console.error('Error fetching floors:', err);
      }
    });
  }
  
  fetchRooms(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    if (!this.item.location || !this.item.floor) return;
  
    const url = `${flask_URL}/editFloor?token=${this.authToken}&user_id=${userId}&role=${role}&selected_building=${this.item.location}&selected_floor=${this.item.floor}`;
  
    this.http.get<any>(url, { withCredentials: true }).subscribe({
      next: data => {
        this.rooms = data.rooms || [];
        this.item.room = '';
      },
      error: err => {
        console.error('Error fetching rooms:', err);
      }
    });
  }  

  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    if (!userId || !role) {
      console.error('Missing authentication data.');
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role);
    formData.append('authToken', this.authToken || '');
    formData.append('worker', this.item.worker);
    formData.append('location', this.item.location);
    formData.append('dateFound', this.item.dateFound);
    formData.append('locationFound', this.item.locationFound);
    formData.append('itemType', this.item.itemType);
    formData.append('description', this.item.description);
    formData.append('floor', this.item.floor);
    formData.append('room', this.item.room);
    formData.append('subcategory', this.item.subcategory);

    this.http.post(`${flask_URL}/Items`, formData, { withCredentials: true }).subscribe({
      next: response => {
        alert('Item successfully added!');
        this.resetForm();
      },
      error: error => {
        console.error('Error adding item:', error);
        alert('Error adding item!');
      }
    });
  }

  resetForm(): void {
    this.item = {
      worker: '',
      location: '',
      floor: '',
      room: '',
      dateFound: '',
      locationFound: '',
      itemType: '',
      subcategory: '',
      description: '',
    };

    this.floors = [];
  }

}
