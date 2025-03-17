//Mary Cottier, Matthew Guild, Shane Petree, Guilherme Cassiano
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
import { MapComponent } from './pages/map/map.component';
import { _404Component } from './pages/404/404.component';
import { AuthGuard } from './auth.guard'; //Ensure only logged people can access certain pages
import { RemoveItemComponent } from './pages/remove-item/remove-item.component';

export const routes: Routes = [
  { path: 'admin-home', component: AdminHomeComponent, canActivate: [AuthGuard] },
  { path: 'super-admin-home', component: SuperAdminHomeComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  //task there is not a way to get to add-user or login yet through the UI
  { path: 'add-user', component: AddUserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'lost-and-found', component: LostAndFoundComponent },
  { path: 'add-item', component: AddItemComponent, canActivate: [AuthGuard] },
  { path: 'claimed-items', component: ClaimedItemsComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent },
  { path: 'remove-item', component: RemoveItemComponent, canActivate:[AuthGuard]},
  //task this would be better if it was an error:404 page
  { path: '404', component: _404Component },
  { path: '**', redirectTo: '404' } // Handles unknown paths
];
