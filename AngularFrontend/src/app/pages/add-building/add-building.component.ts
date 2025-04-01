//Guilherme Cassiano
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'add-building',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor],
  templateUrl: './add-building.component.html',
  styleUrl: './add-building.component.css'
})

export class AddBuildingComponent {
  building: any = {
    BuildingCode: '',
    Latitude: '',
    Longitude: '',
  };
  authToken: string | null = null;
  constructor(private http: HttpClient, private router: Router) { }

  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');
    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.building.coordinates || !this.building.coordinates.includes(',')) {
      console.error("Invalid coordinates format! Expected: Lat, Lng");
      alert("Invalid coordinates format! Please enter: Latitude, Longitude");
      return;
    }

    const [latitude, longitude] = this.building.coordinates.split(',').map(coord => coord.trim());

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role);
    formData.append('BuildingCode', this.building.BuildingCode);
    formData.append('Latitude', latitude);
    formData.append('Longitude', longitude);
    formData.append('authToken', this.authToken);
    console.log("Sending Data:");
    formData.forEach((value, key) => console.log(`${key}: ${value}`));

    this.http.post(`${flask_URL}/addBuilding`, formData, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log("Building added successfully:", response);
        alert('Building successfully added!');
        this.resetForm();
      },
      error => {
        console.error("Error adding building:", error);
        alert('Error adding building!');
      }
    );
  }

  resetForm(): void {
    this.building = {
      BuildingCode: '',
      Latitude: '',
      Longitude: '',
    };
  }

}
