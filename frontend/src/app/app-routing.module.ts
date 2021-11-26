import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HexMapComponent } from './map/hex-map/hex-map.component';
const routes: Routes = [
  { path:'game', component: HexMapComponent},
  { path:'', component: HomeComponent},
  { path:'about',component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
