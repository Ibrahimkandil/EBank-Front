import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Interface1Component} from "./interface1.component";
import {RouterModule, Routes} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";

const routes: Routes = [
  {path: '', component: Interface1Component}
]


@NgModule({
  declarations: [
    Interface1Component
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatTabsModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
    ]
})
export class Interface1Module { }
