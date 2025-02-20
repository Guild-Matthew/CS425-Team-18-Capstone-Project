import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { LostAndFoundComponent } from './lost-and-found/lost-and-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lost-and-found', component: LostAndFoundComponent },
  { path: '**', redirectTo: 'dashboard' } // Handles unknown paths
];
