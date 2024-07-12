import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public doughnutChartLabels: string[] = [this.dateForamt(new Date()), 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  chartOptions = {
    responsive: true
  };

  dateForamt(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() - 1}-${date.getDate()}\n ${date.getHours()}:${date.getMinutes()} `;
  }
}
