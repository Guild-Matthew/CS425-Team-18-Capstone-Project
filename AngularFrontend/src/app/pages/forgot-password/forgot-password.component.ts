// Shane Petree

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { flask_URL } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { PasswordRequirementsService } from '../../services/password-requirements/password-requirements.service';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  NetID: string | null = null;
  email: string | null = null;
  new_password: string | null = null;
  confirm_password: string | null = null;
  auth_code: number | null = null;
  form_states: string[] = ['get_credentials', 'check_auth_code', 'check_passwords_match'];
  form_state: string = this.form_states[0];
  pass_min_length: number;
  submit_button_strings: string[] = ['Check Credentials', 'Check Security Code', 'Change Password'];
  submit_button_str: string = this.submit_button_strings[0];
  
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private validatePass: PasswordRequirementsService) {
    this.forgotPasswordForm = this.fb.group({
      NetID: [this.NetID, Validators.required],
      email: [this.email, Validators.required],
      auth_code: [this.auth_code, Validators.required],
      new_password: [this.new_password, Validators.required],
      confirm_password: [this.confirm_password, Validators.required],
    });

    this.pass_min_length = this.validatePass.getMinPasswordLength();
  }

  onSubmit() {
    this.getFormValues();

    // getting the NetID and email from the user, and checking if the user exists
    if (this.form_state == this.form_states[0]) {
      this.checkUserRequest();
    }

    // checking the security auth_code from the email
    if (this.form_state == this.form_states[1]) {
      this.checkAuthCode();
    }

    // checking if the new passwords match
    if (this.form_state == this.form_states[2]) {
      // check if the passwords match
      if (this.new_password == this.confirm_password) {
        // check if passwords fits the password requirements
        if (this.validatePass.validatePassword(this.new_password) && this.validatePass.validatePassword(this.new_password)) {
          this.changePassword();
        }
        else {
          alert(`Passwords must contain at least ${this.pass_min_length} characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.`);
          this.clearPasswords();
        }
      }
      else {
        alert("Passwords do not match.");
        this.clearPasswords();
      }
    }
  }

  checkUserRequest() {
    //! TEST PRINT
    //console.log(`NetID: ${this.NetID}`);
    //console.log(`email: ${this.email}`);

    const url = `${flask_URL}/checkuser`;

    const formData = new FormData();
    formData.append('username', this.NetID.toString());
    formData.append('email', this.email.toString());

    return this.http.post(url, formData, { withCredentials: true }).subscribe(
      {
        next: data => {
          console.log("Data received:", data);
          alert("A security code was sent to your email.\nPlease enter your one-time security code.");
          this.form_state = this.form_states[1];
          this.getSubmitButtonString();
        },
        error: error => {
          console.error("Error: ", error);
          alert(`Error: Invalid credentials.`);
          this.form_state = this.form_states[0];
          this.clearCredentials();
        },
      }
    );
  }

  checkAuthCode() {
    //! TEST PRINT
    //console.log(`NetID: ${this.NetID}`);
    //console.log(`email: ${this.email}`);

    const url = `${flask_URL}/forgotpassword`;

    const formData = new FormData();
    formData.append('username', this.NetID.toString());
    formData.append('email', this.email.toString());
    formData.append('auth_code', this.auth_code.toString());
    formData.append('action', 'check_auth_code');

    return this.http.post(url, formData, { withCredentials: true }).subscribe(
      {
        next: data => {
          console.log("Data received:", data);
          alert("Please enter your new password.");
          this.form_state = this.form_states[2];
          this.getSubmitButtonString();
        },
        error: error => {
          console.error("Error: ", error);
          alert(`Error: Incorrect security code.`);
          this.clearAuthToken();
        },
      }
    );
  }

  changePassword() {
    const url = `${flask_URL}/forgotpassword`;

    const formData = new FormData();
    formData.append('username', this.NetID.toString());
    formData.append('email', this.email.toString());
    formData.append('new_password', this.new_password.toString());
    formData.append('auth_code', this.auth_code.toString());
    formData.append('action', 'change_password');

    return this.http.post(url, formData, { withCredentials: true }).subscribe(
      {
        next: data => {
          console.log("Data received:", data);
          alert("Password successfully changed.");

          // navigate to login
          this.router.navigate(['/login']);
        },
        error: error => {
          console.error("Error: ", error);
          alert(`Error: Failed to update password.`);
          this.clearPasswords();
        },
      }
    );
  }

  // change what the submit button says based on the form state
  getSubmitButtonString(): void {
    if (this.form_state == this.form_states[0]) {
      this.submit_button_str = this.submit_button_strings[0];
    }
    if (this.form_state == this.form_states[1]) {
      this.submit_button_str = this.submit_button_strings[1];
    }
    if (this.form_state == this.form_states[2]) {
      this.submit_button_str = this.submit_button_strings[2];
    }
  }

  getFormValues(): void {
    this.NetID = this.forgotPasswordForm.get<string>('NetID').value;
    this.email = this.forgotPasswordForm.get<string>('email').value;
    this.auth_code = this.forgotPasswordForm.get<string>('auth_code').value;
    this.new_password = this.forgotPasswordForm.get<string>('new_password').value;
    this.confirm_password = this.forgotPasswordForm.get<string>('confirm_password').value;
  }

  resetForm(): void {
    this.forgotPasswordForm.patchValue({
      'NetID': null,
      'email': null,
      'auth_code': null,
      'new_password': null,
      'confirm_password': null,
    });
    this.NetID = null;
    this.email = null;
    this.auth_code = null;
    this.new_password = null;
    this.confirm_password = null;
    // initial state when you open the form
    this.form_state = this.form_states[0];
  }

  clearCredentials(): void {
    this.forgotPasswordForm.patchValue({
      'NetID': null,
      'email': null,
    });
    this.NetID = null;
    this.email = null;
  }

  clearAuthToken(): void {
    this.forgotPasswordForm.patchValue({
      'auth_code': null,
    });
    this.auth_code = null;
  }

  clearPasswords(): void {
    this.forgotPasswordForm.patchValue({
      'new_password': null,
      'confirm_password': null,
    });
    this.new_password = null;
    this.confirm_password = null;
  }
}
