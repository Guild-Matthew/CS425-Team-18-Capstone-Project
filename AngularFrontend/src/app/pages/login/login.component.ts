//Matthew Guild, Mary Cottier, Shane Petree

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
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
    HttpClientModule,
  ],
})
export class LoginComponent {
  netId: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    const loginData = { NetId: this.netId, password: this.password };
  
    const headers = { 'Content-Type': 'application/json' };

    // Shane Petree 1 line, updated flask URL in http request
    this.http.post(flask_URL + '/login', loginData, { headers, withCredentials: true }).subscribe(
      (response: any) => {

        if (response.success) {

          localStorage.setItem('user_id', response.user_id);
          localStorage.setItem('role', response.role);
          localStorage.setItem('authtoken', response.authtoken);
          if (response.role === 'student' || response.role === 'admin' || response.role === 'superadmin') {
            this.router.navigate(['/dashboard']);
          }
        } else {
          console.error(" Login failed: No success flag in response.");
        }
      },
      (error) => {
        console.error(" Login failed:", error);
      }
    );
  }
}  
