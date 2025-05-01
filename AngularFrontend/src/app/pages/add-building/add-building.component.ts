import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.css']
})
export class AddBuildingComponent implements OnInit {
  building: any = {
    BuildingCode: '',
    coordinates: ''
  };
  role: string | null = null; 
  authToken: string | null = null;

  constructor(private http: HttpClient, private router: Router, public toastService: ToastService) { }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    
    // Redirect non-superadmins to the dashboard or login page
    if (role !== 'superadmin') {
      console.error("Access denied. Redirecting to the dashboard.");
      this.router.navigate(['/dashboard']);  // Or to another page as needed
    }
  }

  onSubmit(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');
  
    if (!userId) {
      this.toastService.add('Session expired. Please log in again.', 3000, 'error');
      this.router.navigate(['/login']);
      return;
    }
  
    if (!this.building.coordinates || !this.building.coordinates.includes(',')) {
      this.toastService.add('Invalid coordinates format! Use: Latitude, Longitude', 3000, 'error');
      return;
    }
  
    const [latitude, longitude] = this.building.coordinates.split(',').map(coord => coord.trim());
  
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role || '');
    formData.append('BuildingCode', this.building.BuildingCode);
    formData.append('Latitude', latitude);
    formData.append('Longitude', longitude);
    formData.append('authtoken', authToken || '');
  
    this.http.post(`${flask_URL}/addBuilding`, formData, { withCredentials: true }).subscribe(
      (response: any) => {
        this.toastService.add('Building successfully added!', 3000, 'success');
        this.resetForm();
      },
      error => {
        console.error("Error adding building:", error);
        this.toastService.add('Error adding building. Please try again.', 3000, 'error');
      }
    );
  }

  resetForm(): void {
    this.building = {
      BuildingCode: '',
      coordinates: ''
    };
  }
}
