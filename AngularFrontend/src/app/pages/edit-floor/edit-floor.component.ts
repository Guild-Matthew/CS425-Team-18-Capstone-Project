// Shane Petree, Mary Cottier
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { flask_URL } from '../../app.config';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list'
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelect,
    MatInput,
    MatOption,
    MatButton,
    MatListModule,
    RouterLink,
    NavBarComponent
  ],
  templateUrl: './edit-floor.component.html',
  styleUrl: './edit-floor.component.css'
})
export class EditFloorComponent implements OnInit {
  editFloorForm: FormGroup;
  user_id: string | null = null;
  role: string | null = null;
  authToken: string | null = null;

  buildings: string[] = [''];
  floors: string[] = [''];
  rooms: string[] = [''];

  selected_building: string | null = null;
  selected_floor: string | null = null;
  selected_room: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public toastService: ToastService
  ) {
    this.editFloorForm = this.fb.group({
      selected_building: ['', Validators.required],
      selected_floor: ['', Validators.required],
      selected_room: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id');
    this.role = localStorage.getItem('role');
    this.authToken = localStorage.getItem('authtoken');
    this.fetchBuildings();
  }

  fetchBuildings(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken')

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    const url = `${flask_URL}/editFloor?token=${authToken}&user_id=${userId}&role=${role}`;

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      {
        next: data => {
          this.buildings = data.buildings;
        },
        error: error => console.error("Error fetching buildings:", error),
      }
    );
  }

  fetchFloors(event: any) {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    this.selected_building = this.editFloorForm.get<string>('selected_building').value;
    this.selected_floor = null;
    this.clearRooms();

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selected_building) {
      console.error("No building selected. Aborting Request.");
      return;
    }

    const url = `${flask_URL}/editFloor?token=${authToken}&user_id=${userId}&role=${role}&selected_building=${this.selected_building}`;

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      {
        next: data => {
          this.floors = data.floors;
        },
        error: error => console.error("Error fetching floors:", error),
      }
    );
  }

  fetchRooms(event: any) {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    this.selected_floor = this.editFloorForm.get<string>('selected_floor').value;
    this.clearRooms();

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selected_building) {
      console.error("No building selected. Aborting Request.");
      return;
    }

    if (!this.selected_floor) {
      console.error("No floor selected. Aborting Request.");
      return;
    }

    const url = `${flask_URL}/editFloor?token=${authToken}&user_id=${userId}&role=${role}&selected_building=${this.selected_building}&selected_floor=${this.selected_floor}`;

    this.http.get<any>(url, { withCredentials: true }).subscribe(
      {
        next: data => {
          this.buildings = data.buildings;
          this.floors = data.floors;
          if (data.rooms.length != 0) {
            this.rooms = data.rooms;
          }
        },
        error: error => console.error("Error fetching rooms:", error),
      }
    );
  }

  addRoom(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    this.getFormValues();

    if (this.editFloorForm.valid) {

      if (!userId || !authToken || this.selected_building === null || this.selected_floor === null || this.selected_room === null) {
        console.error("Missing required data");
        return;
      }

      for (const room of this.rooms) {
        if (room == this.selected_room) {
          this.toastService.add(`Room ${this.selected_room} already exists.`, 3000, 'error');
          return;
        }
      }

      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('role', role || '');
      formData.append('token', authToken);
      formData.append('action', 'add_room');
      formData.append('selected_room', this.selected_room.toString());
      formData.append('selected_floor', this.selected_floor.toString());
      formData.append('selected_building', this.selected_building);

      this.http.post(`${flask_URL}/editFloor`, formData, { withCredentials: true }).subscribe(
        {
          next: response => {
            this.toastService.add(`Room ${this.selected_room} added successfully`, 3000, 'success');
            this.resetForm();
            this.fetchBuildings();
          },
          error: error => {
            this.toastService.add(`Error adding room: ${this.selected_room}`, 3000, 'error');
            console.error(`Error adding room: ${this.selected_room}`, error);
          }
        }
      );
    }

    else {
      console.error("Missing required data");
    }
  }

  removeRoom(roomToRemove: string): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');
    const authToken = localStorage.getItem('authtoken');

    if (!userId || !authToken || !this.selected_building || !this.selected_floor || !roomToRemove) {
      console.error("Missing required data");
      return;
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('role', role || '');
    formData.append('token', authToken);
    formData.append('action', 'remove_room');
    formData.append('selected_room', roomToRemove.toString());
    formData.append('selected_floor', this.selected_floor.toString());
    formData.append('selected_building', this.selected_building);

    this.http.post(`${flask_URL}/editFloor`, formData, { withCredentials: true }).subscribe(
      {
        next: response => {
          this.toastService.add(`Room ${roomToRemove} successfully removed`, 3000, 'success');
          this.fetchRooms(null); 
        },
        error: error => {
          this.toastService.add(`Error removing room: ${roomToRemove}`, 3000, 'error');
          console.error(`Error removing room: ${roomToRemove}`, error);
        }
      }
    );
  }

  getFormValues(): void {
    this.selected_building = this.editFloorForm.get<string>('selected_building').value;
    this.selected_floor = this.editFloorForm.get<string>('selected_floor').value;
    this.selected_room = this.editFloorForm.get<string>('selected_room').value;
  }

  resetForm(): void {
    this.editFloorForm.patchValue({
      'selected_building': null,
      'selected_floor': null,
      'selected_room': null,
    });
    this.selected_building = null;
    this.selected_floor = null;
    this.selected_room = null;
    this.rooms = [''];
  }

  clearRooms(): void {
    this.editFloorForm.patchValue({
      'selected_room': null,
    });
    this.selected_room = null;
    this.rooms = [''];
  }
}
