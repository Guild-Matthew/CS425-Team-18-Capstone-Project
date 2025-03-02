import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { LostAndFoundComponent } from './pages/lost-and-found/lost-and-found.component';
import { AddItemComponent } from './pages/add-item/add-item.component';
import { ClaimedItemsComponent } from './pages/claimed-items/claimed-items.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
//import { MapComponent } from './map/map.component';

// adding components for each page
//import { LostFoundComponent } from './lost-found/lost-found.component';
//import { AddItemComponent } from './add-item/add-item.component';
//import { RemoveItemComponent } from './remove-item/remove-item.component';

//import { ClaimedItemsComponent } from './claimed-items/claimed-items.component';
//import { DeactivateuserComponent } from './deactivateuser/deactivateuser.component';
//import { ItemsComponent } from './items/items.component';

//import { LoginComponent } from './login/login.component';
//import { UserHomeComponent } from './user-home/user-home.component';
//import { AdminHomeComponent } from './admin-home/admin-home.component';

//import { SuperHomeComponent } from './super-home/super-home.component';
//import { AddUserComponent } from './adduser/adduser.component';
//import { SuperadduserComponent } from './superadduser/superadduser.component';


export const routes: Routes = [
  //{
  //  path: 'app',
  //  title: 'app-root',
  //  component: AppComponent,
  //},
  //{
  //  path: 'map',
  //  title: 'Map Page',
  //  component: MapComponent,
  //},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'lost-and-found', component: LostAndFoundComponent },
  { path: 'add-item', component: AddItemComponent },
  { path: 'claimed-items', component: ClaimedItemsComponent },
  { path: '**', redirectTo: 'dashboard' } // Handles unknown paths
]
