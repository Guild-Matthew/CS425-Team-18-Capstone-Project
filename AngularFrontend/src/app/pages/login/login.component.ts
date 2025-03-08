//Matthew Guild and Shane Petree

import { Component, OnInit, inject, } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, EmailValidator } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
})
// Shane Petree
export class LoginComponent implements OnInit{

  private http = inject(HttpClient);

  // get the 
  //getFlaskURL(): string {
  //  this.http.get<any>("");
  //  flaskURL: URL = ;
  //}

  loginForm: FormGroup;
  ngOnInit() {
    // the (null) means there is no default value
    this.loginForm = new FormGroup({
      NetID: new FormControl(null),
      //? EmailValidator? maybe we could use this to check for valid emails in the future for 2FA
      email: new FormControl(null),
      // this should be made private if thats possible, but I'm not going to worry about it now
      //task the pasword should be hashed before the http request is made, todo later 
      password: new FormControl(null),
    });
  }

  onSubmit() {
    // log the form info to the console
    console.log(this.loginForm);
    //xconsole.warn(this.loginForm);
    //console.log(`Username: ${this.username}, Comments: ${this.comments}`);

    //! http request
    // create a http client
    //this.http.post();
  }
}
