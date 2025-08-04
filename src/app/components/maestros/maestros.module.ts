import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaestrosRoutingModule } from './maestros-routing.module';
import { MaestrosComponent } from './maestros.component';


@NgModule({
  declarations: [
    MaestrosComponent
  ],
  imports: [
    CommonModule,
    MaestrosRoutingModule
  ]
})
export class MaestrosModule { }
