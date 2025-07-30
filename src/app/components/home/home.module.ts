import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './pages/home.component';
import { CarouselModule } from 'primeng/carousel';
import { HomeRoutingModule } from './home-routing.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    CarouselModule,
    HomeRoutingModule,
    ButtonModule
  ]
})
export class HomeModule { }
