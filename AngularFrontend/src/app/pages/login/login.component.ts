//Matthew Guild, Mary Cottier, Shane Petree

import { Component, OnInit, inject, } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, FormBuilder, EmailValidator } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flask_URL } from '../../app.config';

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
		Observable,
	],
})

// Shane Petree and Mary Cottier
export class LoginComponent implements OnInit{

	//!DELETE LATER
	netID: string = '';
	password: string = '';
	constructor(private http: HttpClient, private router: Router) { }

	loginForm: FormGroup;
	ngOnInit() {
		// the (null) means there is no default value
		this.loginForm = new FormGroup({
			NetID: new FormControl(null),

			// this should be made private if thats possible, but I'm not going to worry about it now
			//task the pasword should be hashed before the http request is made, todo later 
			password: new FormControl(null),
		});
	}

	onSubmit() {
		// log the form info to the console
		console.log(this.loginForm);

		//const post_URL = flask_URL;

		// hash the password

		const loginData = { NetId: this.netID, password: this.password };

		const headers = { 'Content-Type': 'application/json' };

		//this.http.post('http://localhost:52363/login', loginData, { headers }).subscribe(
			//(response: any) => {
		//this.http.post(flask_URL + '/login', loginData, { headers }).subscribe(

		this.http.post('http://localhost:52363/login', loginData, {observe: 'response'}).subscribe(
			(response: any) => {
				console.log("Backend Response:", response);  // Check what the backend returns
				if (response.success) {
					localStorage.setItem('user', JSON.stringify(response.user));
					this.router.navigate(['/dashboard']);
					alert(response.message);  // Display message from backend
				}
			},
			(error) => {
				console.error('Login failed', error);
				alert('Login failed. Please check your credentials.');
			}
		);

	}
}
