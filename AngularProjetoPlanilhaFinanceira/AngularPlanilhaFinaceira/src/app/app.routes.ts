import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { DashboardComponent } from './dashboard-component/dashboard-component';

export const routes: Routes = [

  {path: '', component:HomeComponent},
  {path: 'dashboard', component:DashboardComponent}
];
