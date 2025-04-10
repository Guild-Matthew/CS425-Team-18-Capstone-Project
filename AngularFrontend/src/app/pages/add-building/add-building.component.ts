//Guilherme Cassiano, Matthew Guild
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.css']
})
export class AddBuildingComponent {
  buildingForm: FormGroup;
  imageFile: File | null = null;

  building = {
    BuildingCode: '',
    coordinates: ''
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.buildingForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      coordinates: ['', Validators.required],
      image: [null]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.buildingForm.invalid) {
      this.snackBar.open('Please fill in all required fields.', 'Close', { duration: 3000 });
      return;
    }

  
    console.log('Submitted building:', {
      formValues: this.buildingForm.value,
      modelValues: this.building,
      file: this.imageFile
    });

    this.snackBar.open('Building saved locally (no backend)', 'Close', { duration: 3000 });

    // Optional navigation
    this.router.navigate(['/']);
  }
}
