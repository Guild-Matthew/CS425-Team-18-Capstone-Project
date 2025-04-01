//Mary Cottier, Shane Petree, Guilherme Cassiano
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor]
})
export class AddItemComponent implements OnInit {
  item: any = {
    worker: '',
    location: '',
    dateFound: '',
    locationFound: '',
    itemType: '',
    description: '',
    imagePhoto: null
  };
  authToken: string | null = null;
  buildings: string[] = [];  

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.fetchBuildings();
    this.authToken = localStorage.getItem('authtoken');
  }

  fetchBuildings(): void {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    const url = `${flask_URL}/Items?user_id=${userId}`;

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      data => {
        console.log("Buildings received:", data.buildings);
        this.buildings = data.buildings;
      },
      error => console.error("Error fetching buildings:", error)
    );
  }

  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role);
    formData.append('worker', this.item.worker);
    formData.append('location', this.item.location);  // Ensure selected building is included
    formData.append('dateFound', this.item.dateFound);
    formData.append('locationFound', this.item.locationFound);
    formData.append('itemType', this.item.itemType);
    formData.append('description', this.item.description);
    formData.append('authToken', this.authToken);

    if (this.item.imagePhoto) {
      formData.append('imagePhoto', this.item.imagePhoto);
    }

    console.log("Sending data:");
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    this.http.post(`${flask_URL}/Items`, formData, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log("tem added successfully:", response);
        alert('Item successfully added!');
        this.resetForm();
      },
      error => {
        console.error("Error adding item:", error);
        alert('Error adding item!');
      }
    );
  }

  resetForm(): void {
    this.item = {
      worker: '',
      location: '',
      dateFound: '',
      locationFound: '',
      itemType: '',
      description: '',
      imagePhoto: null
    };
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.item.imagePhoto = file;
      console.log('File selected:', file.name);
    }
  }

  toggleClothingFields(): void {
    console.log('Item type changed to:', this.item.itemType);
  }
}
