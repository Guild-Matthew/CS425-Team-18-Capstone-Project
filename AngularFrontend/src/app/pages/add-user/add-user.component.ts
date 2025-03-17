// Mary Cottier
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { flask_URL } from '../../app.config';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterLink,
    HttpClientModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  userRole: string = ''; // Logged-in user's role
  availableRoles: string[] = []; // Roles available for selection
  addUserForm: FormGroup;

  buildings = [
    { id: 'AB', name: 'AB' },
    { id: 'DMSC', name: 'DMSC' },
    { id: 'SEM', name: 'SEM' },
    { id: 'WFC', name: 'WFC' },
    { id: 'CFA', name: 'CFA' }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.addUserForm = this.fb.group({
      netID: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]], // Role dropdown
      buildings: this.fb.array([]), // Stores selected buildings
    });
  }

  ngOnInit() {
    // Fetch the logged-in user's role from the backend
    this.http.get<{ role: string }>('http://localhost:52363/getUserRole', { withCredentials: true })
      .subscribe(
        response => {
          this.userRole = response.role;
          this.setAvailableRoles();
        },
        error => {
          console.error('Error fetching user role:', error);
        }
      );
  }

  setAvailableRoles() {
    // Set role options based on the logged-in user's role
    if (this.userRole === 'admin') {
      this.availableRoles = ['student']; // Admin can only add students
    } else if (this.userRole === 'superadmin') {
      this.availableRoles = ['student', 'admin', 'superadmin']; // Superadmin can add all roles
    }
  }

  onCheckboxChange(event: any) {
    const buildingsArray: FormArray = this.addUserForm.get('buildings') as FormArray;

    if (event.target.checked) {
      buildingsArray.push(this.fb.control(event.target.value));
    } else {
      const index = buildingsArray.controls.findIndex(
        (control) => control.value === event.target.value
      );
      if (index !== -1) {
        buildingsArray.removeAt(index);
      }
    }
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      const formData = this.addUserForm.value;
      const userData = {
        netID: formData.netID,
        password: formData.password,
        email: formData.email,
        role: formData.role?.trim(),
        buildings: formData.buildings,
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      console.log("Submitting role:", this.addUserForm.value.role);
      console.log("Submitting user data:", userData);
      
      this.http.post('http://localhost:52363/adduser', userData, { 
        withCredentials: true,
        headers
      })
      .subscribe(
        response => {
          console.log("User added successfully!", response);
        },
        error => {
          console.error("Error adding user:", error);
        }
      );
    }
  }
}
