import { Routes } from '@angular/router';
import { AppComponent } from './app.component'; // ✅ Ensure this import exists
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ItemsComponent } from './items/items.component';
import { LoginComponent } from './login/login.component';
import { LostAndFoundComponent } from './lost-and-found/lost-and-found.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ClaimedItemsComponent } from './claimed-items/claimed-items.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lost-and-found', component: LostAndFoundComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'claimed-items', component: ClaimedItemsComponent },
  { path: '**', redirectTo: 'dashboard' } // Handles unknown paths
];
