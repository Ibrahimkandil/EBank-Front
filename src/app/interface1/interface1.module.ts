import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Interface1Component} from "./interface1.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {path: '', component: Interface1Component}
]


@NgModule({
  declarations: [
    Interface1Component
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class Interface1Module { }
