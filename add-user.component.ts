import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCheckboxModule], // ✅ Import MatCheckboxModule
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  addUserForm: FormGroup;
  buildings = [
    { id: 'AB', name: 'AB' },
    { id: 'DLM', name: 'DLM' },
    { id: 'JCSU', name: 'JCSU' },
    { id: 'WFC', name: 'WFC' }
  ];

  constructor(private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      netID: ['', Validators.required],
      NSHEID: ['', Validators.required],
      password: ['', Validators.required],
      AB: [false],
      DLM: [false],
      JCSU: [false],
      WFC: [false]
    });
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      console.log('Form Submitted:', this.addUserForm.value);
      alert('User successfully added!');
      this.addUserForm.reset();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
