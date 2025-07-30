import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './pages/home.component';
import { CarouselModule } from 'primeng/carousel';
import { HomeRoutingModule } from './home-routing.module'; // ← FALTABA ESTO

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
