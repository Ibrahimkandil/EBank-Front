import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {WalletDashboardComponent} from "./WalletDashboard.component";
import {CardLineChartComponent} from "./card-line-chart/card-line-chart.component";
import {CardBarChartComponent} from "./card-bar-chart/card-bar-chart.component";
import {CardPageVisitsComponent} from "./card-page-visits/card-page-visits.component";
import {CardSocialTrafficComponent} from "./card-social-traffic/card-social-traffic.component";
import {HeaderStatsComponent} from "./header-stats/header-stats.component";
import {CardStatsComponent} from "./card-stats/card-stats.component";


const routes: Routes = [
  {path: '', component: WalletDashboardComponent}
]


@NgModule({
  declarations: [
    WalletDashboardComponent,
    CardLineChartComponent,
    CardBarChartComponent,
    CardPageVisitsComponent,
    CardSocialTrafficComponent,
    HeaderStatsComponent,
    CardStatsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class WalletDashboardModule { }
