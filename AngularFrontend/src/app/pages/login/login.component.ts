//Matthew Guild, Mary Cottier

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
  
    this.http.post(flask_URL + '/login', loginData, { headers, withCredentials: true }).subscribe(
      (response: any) => {
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('authToken', response.authToken);
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin-home']);
          } else if(response.user.role === 'superadmin'){
            this.router.navigate(['/super-admin-home']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }
      },
    );
  }  
}  
