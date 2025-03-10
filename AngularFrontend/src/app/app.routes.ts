// Someone and Shane Petree

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LostAndFoundComponent } from './pages/lost-and-found/lost-and-found.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ClaimedItemsComponent } from './pages/claimed-items/claimed-items.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
//task map page doesn't work yet
//import { MapComponent } from './map/map.component';

export const routes: Routes = [
  //{
  //task map page doesn't work yet
  //  path: 'map',
  //  title: 'Map Page',
  //  component: MapComponent,
  //},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  //task there is not a way to get to add-user or login yet through the UI
  { path: 'add-user', component: AddUserComponent },
  { path: 'login', component: LoginComponent },

  { path: 'lost-and-found', component: LostAndFoundComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'claimed-items', component: ClaimedItemsComponent },
  //task this would be better if it was a error:404 page
  { path: '**', redirectTo: 'dashboard' } // Handles unknown paths
]
