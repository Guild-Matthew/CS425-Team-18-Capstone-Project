//Mary Cottier, Matthew Guild, Shane Petree
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { LoginComponent } from './pages/login/login.component';
import { LostAndFoundComponent } from './pages/lost-and-found/lost-and-found.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ClaimedItemsComponent } from './pages/claimed-items/claimed-items.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { SuperAdminHomeComponent } from './pages/super-admin-home/super-admin-home.component';

export const routes: Routes = [
  { path: 'admin-home', component: AdminHomeComponent },
  { path: 'super-admin-home', component: SuperAdminHomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //task there is not a way to get to add-user or login yet through the UI
  { path: 'add-user', component: AddUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lost-and-found', component: LostAndFoundComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'claimed-items', component: ClaimedItemsComponent },
  //task this would be better if it was an error:404 page
  { path: '**', redirectTo: 'login' } // Handles unknown paths
];
