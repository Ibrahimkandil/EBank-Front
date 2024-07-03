import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Chart } from 'chart.js'
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {WalletDashboardService} from "../wallet-dashboard.service";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable} from "rxjs";

@Component({
  selector: "app-card-bar-chart",
  templateUrl: "./card-bar-chart.component.html",
})
export class CardBarChartComponent implements OnInit, AfterViewInit {
  rates:any=[]
  form: FormGroup;
  options1: string[] = [];
  options2: string[] = [];
  options3: string[] = [];
  currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  mode = ['Buy', 'Sell'];

  constructor(      private cookieservice:CookieService,
                    private snackBar: MatSnackBar,private fb: FormBuilder,private http:HttpClient,private walletDashboardService: WalletDashboardService ) {
    this.form = this.fb.group({
      dropdown1: [''],
      dropdown2: [''],
      dropdown3: [''],
      input1: [0]
    });
    this.GetCompteBancaire()
    this.getExchangeRates().subscribe((res:any)=>
    {
      this.rates=res.rates
      console.log("res",this.rates)
      this.selectedRate=this.rates['USD']


    },
      (err:any)=>{

      })
  }
  historicalData: any = [];

  ngOnInit(): void {
    for(let i =0;i<this.currencies.length;i++){
      this.historicalData[i]={
        currency:this.currencies[i],
        rates:[]
      }
    }

  }
  comptes:any;
  listcomptes:any=[]
  GetCompteBancaire(){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieservice.get('token')
    });
    this.http.get('http://localhost:8081/ebank/api/v1/client/comptes/'+this.cookieservice.get('id'), {headers: headers}).
    subscribe((resp: any) => {
      this.comptes=resp;
      for(let i =0;i<this.comptes.length;i++){
        this.listcomptes[i]=this.comptes[i].account_number
      }
      console.log("this.comptes",this.comptes)
      console.log("this.comptes.length",this.comptes.length)
      console.log("this.comptes.account_number",this.comptes[0].account_number)
      console.log("this.listcomptes",this.listcomptes)

  })
  }
  datas_CompteBancaire:any=null
  h1(e:any) {
      this.datas_CompteBancaire= this.comptes.find((element: any) => element.account_number === e);
    console.log("e", e)
    console.log("this.Co,pt",this.datas_CompteBancaire)
  }
  onSubmit(): void {

    console.log("this.task",this.task)
    console.log("this.task",this.task)
    if(this.task==="CREATE" && this.objWallet===null ){
      if(this.form.get('input1')?.value!=0){
      let body={

        "currency":this.cuurency,

         "id_client":this.cookieservice.get("id"),
         "double balance":this.form.get('input1')?.value
      }
        this.http.post('http://localhost:8081/ebank/api/v1/client/wallets/'+this.datas_CompteBancaire.id,body, {headers: this.headers}).
        subscribe((resp: any) => {},(err:any)=>{})

      }

    }
    // console.log(this.form.value);
  }
  getExchangeRates(): Observable<any> {
    let url=`https://api.exchangerate-api.com/v4/latest/TND`
    return this.http.get<any>(url);
  }

  ngAfterViewInit() {
    let config:any = {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#ed64a6",
            borderColor: "#ed64a6",
            data: [30, 78, 56, 34, 100, 45, 13],
            fill: false,
            barThickness: 8,
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: [27, 68, 86, 74, 10, 4, 87],
            barThickness: 8,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Orders Chart",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        legend: {
          labels: {
            fontColor: "rgba(0,0,0,.4)",
          },
          align: "end",
          position: "bottom",
        },
        scales: {
          xAxes: [
            {
              display: false,
              scaleLabel: {
                display: true,
                labelString: "Month",
              },
              gridLines: {
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(33, 37, 41, 0.3)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: false,
                labelString: "Value",
              },
              gridLines: {
                borderDash: [2],
                drawBorder: false,
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.2)",
                zeroLineColor: "rgba(33, 37, 41, 0.15)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          ],
        },
      },
    };
    let ctx: any = document.getElementById("bar-chart");
    ctx = ctx.getContext("2d");
    new Chart(ctx, config);
  }
  rate_Init=this.rates[`${this.currencies[0]}`]










task=""
  objWallet:any=null
   headers = new HttpHeaders({
    'Authorization': 'Bearer '+this.cookieservice.get('token')
  });
  selectedRate:any
  cuurency:any="USD"
  h2(e:any) {
    console.log("e", this.rates[`${e}`])
    this.cuurency=e
    this.selectedRate=this.rates[`${e}`]
    let body={
      "currency":e,
      "id_client":parseInt(this.cookieservice.get('id'))

    }

    this.http.post('http://localhost:8081/ebank/api/v1/client/wallets/Bycurrency',body, {headers: this.headers}).
    subscribe((resp: any) => {
      if(resp==="CREATE"){
        this.task=resp
      }else{
        this.objWallet=resp
      }
    },(err:any)=>{})
  }
  valueInDinar:any=0
  supthanbalance:boolean=false
  meth:any="Buy"

  h0(e:any){
 this.meth=e
  }
  h3(e:any){
    console.log('selectedRate',this.selectedRate)
    if(this.meth==="Buy"){

      this.valueInDinar=this.form.get('input1')?.value/this.selectedRate
    }else{
      this.valueInDinar=this.form.get('input1')?.value/this.selectedRate

    }

    if(this.valueInDinar>this.datas_CompteBancaire.balance) {
      this.supthanbalance=true
    }else{
      this.supthanbalance=false
    }
    console.log(e)
    console.log(this.form.get('input1')?.value)
  }
}
