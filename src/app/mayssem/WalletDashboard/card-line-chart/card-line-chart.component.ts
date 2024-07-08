import {Component, OnInit, ElementRef, ViewChild} from "@angular/core";
import { Chart } from "chart.js";
import {WalletDashboardService} from "../wallet-dashboard.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: "app-card-line-chart",
  templateUrl: "./card-line-chart.component.html",

  styleUrls: ['./card-line-chart-component.css']
})
export class CardLineChartComponent implements OnInit {
  dates: any=[];
  historicalData: any = [];
  historicalByHeure: any = [];
  values:any=[];
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineHeureChartCanvas') lineHeureChartCanvas!: ElementRef<HTMLCanvasElement>;

  currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  element:any;
  element1:any;
  constructor(private http:HttpClient,private walletDashboardService: WalletDashboardService) {


  }


    ngOnInit(): void {
      for(let i =0;i<this.currencies.length;i++){
        this.historicalData[i]={
          currency:this.currencies[i],
          rates:[]
        }
      }

      const today=new Date();
      for (let j = 4; j >= 0; j--) {
        const clonedDate = new Date(today);
        clonedDate.setDate(today.getDate() - j);
        const formattedDate = this.formatDate(clonedDate);
        this.dates.push(formattedDate);
      }
      this.getExchangeRates().subscribe((data: any) => {
        this.values=data
        for(let x=0;x<this.dates.length;x++){
          for(let i =0;i<this.currencies.length;i++){
            let randomValue = 0;
            if(x==this.dates.length-1){
              this.historicalData[i].rates.push(this.values.rates[this.currencies[i]]);
            }else{
              randomValue = randomValue = (Math.random() - 0.5) / 5;
              let value =this.values.rates[this.currencies[i]]+randomValue
              let valueofthree=parseFloat(value.toFixed(3))
              this.historicalData[i].rates.push(valueofthree);
            }
          }
        }
        let now = new Date();
        for (let i = 4; i >= 0; i--) {
          let clonedDate = new Date(now);
          clonedDate.setHours(now.getHours() - i);
          let formattedDate = this.formatDateenHeure(clonedDate);
          this.dateEnheures.push(formattedDate);
        }
        this.createChart(this.historicalData[0], this.dates,"line-chart")
        this.createChart(this.historicalData[0],this.dateEnheures,"line-heure-chart")

      }, (error: any) => {
        console.log("err",error)

      })




    }


dateEnheures:any=[]

  ngAfterViewInit() {

  }
  createChart(currencyData: any, dates: any, id: string) {
    var config: any = {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: currencyData.currency,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: currencyData.rates,
            fill: false,
          }
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Exchange Rates",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Date",
                fontColor: "white",
              },
              gridLines: {
                display: false,
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,.7)",
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Exchange Rate",
                fontColor: "white",
              },
              gridLines: {
                borderDash: [3],
                borderDashOffset: [3],
                drawBorder: false,
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };

    let ctx: any;
    if (id === 'line-chart' && this.lineChartCanvas) {
      ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    } else if (id === 'line-heure-chart' && this.lineHeureChartCanvas) {
      ctx = this.lineHeureChartCanvas.nativeElement.getContext('2d');
    }

    if (!ctx) {
      console.error(`Cannot find canvas element with id ${id}`);
      return;
    }

    new Chart(ctx, config);
  }



  fetchCurrency(){

  }

  getExchangeRates(): Observable<any> {
    let url=`https://api.exchangerate-api.com/v4/latest/TND`
    return this.http.get<any>(url);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1); // Months are zero indexed
    const day = this.padNumber(date.getDate());
    return `${year}-${month}-${day}`;
  }
  formatDateenHeure(date: Date): string {
    const hour = date.getHours();
    const min = this.padNumber(date.getMinutes() + 1); // Months are zero indexed
    return `${hour}:00`;
  }
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }

  h1(e:any) {
    let findByCurrency = this.historicalData.find((element: any) => element.currency === e);
    this.createChart(findByCurrency, this.dates,"line-chart")
  }



}
