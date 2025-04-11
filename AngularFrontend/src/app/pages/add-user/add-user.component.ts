// Matthew Guild, Shane Petree, Guilherme Cassiano, Mary Cottier
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { flask_URL } from '../../app.config';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterLink
  ],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  buildings: string[] = [];
  authToken: string | null = null;
  role: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.addUserForm = this.fb.group({
      netID: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      selectedRole: ['', Validators.required],
      buildings: this.fb.array([]) 
    });
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('authtoken');
    this.role = localStorage.getItem('role');
    this.fetchBuildings();
  }

  fetchBuildings(): void {
    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    if (!userId) {
      console.error("No user ID found. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    const url = `${flask_URL}/adduser?user_id=${userId}&role=${role}`;
    this.http.get<any>(url, { withCredentials: true }).subscribe({
      next: data => {
        this.buildings = data.buildings || [];
        console.log("Buildings received:", this.buildings);
      },
      error: err => console.error("Error fetching buildings:", err)
    });
  }

  onCheckboxChange(event: any): void {
    const buildingsArray = this.addUserForm.get('buildings') as FormArray;

    if (event.target.checked) {
      buildingsArray.push(this.fb.control(event.target.value));
    } else {
      const index = buildingsArray.controls.findIndex(
        control => control.value === event.target.value
      );
      if (index !== -1) {
        buildingsArray.removeAt(index);
      }
    }
  }

  onSubmit(): void {
    const userId = localStorage.getItem('user_id');

    if (!userId || !this.authToken) {
      console.error("Missing user ID or token. Redirecting to login.");
      this.router.navigate(['/login']);
      return;
    }

    if (this.addUserForm.valid) {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('authToken', this.authToken);
      formData.append('netID', this.addUserForm.value.netID);
      formData.append('email', this.addUserForm.value.email);
      formData.append('password', this.addUserForm.value.password);
      formData.append('selectedRole', this.addUserForm.value.selectedRole);
      formData.append('buildings', JSON.stringify(this.addUserForm.value.buildings));

      this.http.post(`${flask_URL}/adduser`, formData, { withCredentials: true }).subscribe({
        next: response => {
          console.log("User added successfully:", response);
          alert('User successfully added!');
          this.resetForm();
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          console.error("Error adding user:", err);
          alert('Error adding user!');
        }
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }

  resetForm(): void {
    this.addUserForm.reset();
    const buildingsArray = this.addUserForm.get('buildings') as FormArray;
    while (buildingsArray.length !== 0) {
      buildingsArray.removeAt(0);
    }
  }
}
