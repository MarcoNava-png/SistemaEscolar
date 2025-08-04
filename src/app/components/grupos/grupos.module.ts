import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruposRoutingModule } from './grupos-routing.module';
import { GruposComponent } from './grupos.component';


@NgModule({
  declarations: [
    GruposComponent
  ],
  imports: [
    CommonModule,
    GruposRoutingModule
  ]
})
export class GruposModule { }
