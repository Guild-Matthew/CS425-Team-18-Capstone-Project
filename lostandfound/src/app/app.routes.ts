import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'adduser', component: AddUserComponent },
  { path: '**', redirectTo: 'dashboard' } // Handles unknown paths
];
