import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { flask_URL } from '../../app.config';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'add-floor',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule, FormsModule],
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.css']
})
export class AddFloorComponent implements OnInit {
  items: any[] = [];
  buildings: string[] = [];
  authToken: string | null = null;
  selectedBuilding: string = '';
  floors: string[] = [];
  newFloorNumber: number | null = null;
  role: string | null = null; 

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();  
    this.route.queryParams.subscribe(params => {
      this.selectedBuilding = params['selected_building'] || '';
      this.fetchItems();
    });
    this.authToken = localStorage.getItem('authtoken');
  }

  checkLoginStatus() {
    this.role = localStorage.getItem('role');
    if (this.role !== 'student' && this.role !== 'admin' && this.role !== 'superadmin') {
      this.toastService.add("You are not authorized. Redirecting to login.", 3000, 'error');
      this.router.navigate(['/login']);
    } else {
      console.log(`User is logged in as: ${this.role}`);
    }
  }

  fetchItems(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId) {
      this.toastService.add("No user ID found. Redirecting to login.", 3000, 'error');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedBuilding) {
      this.selectedBuilding = "Please select a building";
    }

    const url = `${flask_URL}/editBuilding?token=${authToken}&user_id=${userId}&role=${role}&selected_building=${this.selectedBuilding}`;
    this.http.get<any>(url, { withCredentials: true }).subscribe(
      data => {
        this.items = data.items;
        this.buildings = data.buildings;
        this.floors = data.floors;
        this.selectedBuilding = data.selected_building;
      },
      error => this.toastService.add("Error fetching items", 3000, 'error')
    );
  }

  addFloor(form: NgForm): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId || !authToken || !this.selectedBuilding || this.newFloorNumber === null) {
      this.toastService.add("Missing required data", 3000, 'error');
      return;
    }

    for (const floor of this.floors) {
      if (floor === this.newFloorNumber?.toString()) {
        this.toastService.add(`Floor ${this.newFloorNumber} already exists.`, 3000, 'error');
        return;
      }
    }    

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role || '');
    formData.append('token', authToken);
    formData.append('action', 'add_floor');
    formData.append('floorNumber', this.newFloorNumber.toString());
    formData.append('selected_building', this.selectedBuilding);

    this.http.post(`${flask_URL}/editBuilding`, formData, { withCredentials: true }).subscribe(
      response => {
        this.toastService.add('Floor added successfully', 3000, 'success');
        this.newFloorNumber = null;
        form.resetForm();
        this.fetchItems();
      },
      error => this.toastService.add('Error adding floor', 3000, 'error')
    );
  }

  removeFloor(floor: string): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId || !authToken || !this.selectedBuilding) {
      this.toastService.add("Missing required data for removal", 3000, 'error');
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role || '');
    formData.append('token', authToken);
    formData.append('action', 'remove_floor');
    formData.append('floor_number', floor);
    formData.append('selected_building', this.selectedBuilding);

    this.http.post(`${flask_URL}/editBuilding`, formData, { withCredentials: true }).subscribe(
      response => {
        this.toastService.add(`Floor ${floor} removed successfully`, 3000, 'success');
        this.fetchItems();
      },
      error => this.toastService.add('Error removing floor', 3000, 'error')
    );
  }
}
