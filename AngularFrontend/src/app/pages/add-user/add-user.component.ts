//Mary Cottier
import { Component } from '@angular/core';
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
export class AddUserComponent {
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
      role: ['', [Validators.required]],
      buildings: this.fb.array([]), // Stores selected buildings
    });
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
        role: formData.role?.trim(),        buildings: formData.buildings,
      };
  
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'  // Ensure content type is set for POST requests
      });

      console.log("Submitting role:", this.addUserForm.value.role);
      console.log("Submitting user data:", userData);
      console.log('Request Headers:', headers);
      
      this.http.post('http://localhost:52363/adduser', userData, { 
        withCredentials: true,  // Ensures session cookies are sent!
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
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
