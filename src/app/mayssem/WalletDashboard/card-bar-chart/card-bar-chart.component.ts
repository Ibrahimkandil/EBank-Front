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
  account_number=null

  input_Compte:boolean=true
  input_currency:boolean=true
  input_montant:boolean=false


  currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];
  Currenciess:any[]=[]
  mode = ['Buy', 'Sell'];

  constructor(      private cookieservice:CookieService,
                    private snackBar: MatSnackBar,private fb: FormBuilder,private http:HttpClient,private walletDashboardService: WalletDashboardService ) {
    this.form = this.fb.group({
      dropdown1: [''],
      dropdown2: [''],
      dropdown3: [''],
      input1: [0]
    });
    this.Currenciess=this.currencies
    this.GetCompteBancaire()
    this.getExchangeRates().subscribe((res:any)=>
    {
      this.rates=res.rates
      console.log("res",this.rates)
      this.selectedRate=this.rates['USD']



    },
      (err:any)=>{

      })
    let body={
      "currency":this.Currenciess[0],
      "id_client":parseInt(this.cookieservice.get('id'))

    }

    this.http.post<any>('http://localhost:8081/ebank/api/v1/client/wallets/Bycurrency',body, {headers: this.headers})
        .subscribe((resp: any) => {
          console.log("resp===\"CREATE\"",resp==="CREATE")


          console.log("resp",resp)

          this.objWallet=resp
          // this.task=resp

        },(err:any)=>{
          console.log("errrr",err)
          this.task=err.error.text

        })
    this.input_Compte=false
    console.log("this.cuurency!==null ", this.cuurency!==null )
    console.log("this.datas_CompteBancaire!==null" ,
    this.datas_CompteBancaire!==null )
    console.log("this.form.get('input1')?.value !=0 " ,
    this.form.get('input1')?.value !=0 )

    console.log("this.cuurency!==null && this.datas_CompteBancaire!==null && this.form.get('input1')?.value !=0 && this.datas_CompteBancaire.balance>this.valueInDinar",this.cuurency!==null && this.datas_CompteBancaire!==null && this.form.get('input1')?.value !=0 )
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


      if (this.datas_CompteBancaire != null) {
        this.cuurency = null
        this.selectedRate = null

      }
    this.datas_CompteBancaire = this.comptes.find((element: any) => element.account_number === e);
    this.account_number = this.datas_CompteBancaire.account_number
    console.log("e", e)
    console.log("this.Compte", this.datas_CompteBancaire)
    if(this.meth==="Buy") {



      let body = {
        "currency": this.cuurency,
        "id_client": parseInt(this.cookieservice.get('id')),
        "account_number": this.datas_CompteBancaire.account_number

      }
      this.http.post<any>('http://localhost:8081/ebank/api/v1/client/wallets/Bycurrency',body, {headers: this.headers})
          .subscribe((resp: any) => {
            console.log("resp===\"CREATE\"",resp==="CREATE")


            console.log("resp",resp)

            this.objWallet=resp
            // this.task=resp

          },(err:any)=>{
            console.log("errrr",err)
            this.task=err.error.text

          })
    }else{
      if(this.datas_CompteBancaire!==null){
    this.http.get<any>('http://localhost:8081/ebank/api/v1/client/wallets/allById_clientANDid_compte/'+this.cookieservice.get('id')+'/'+this.datas_CompteBancaire.id, {headers: this.headers})
        .subscribe((resp: any) => {
          this.Currenciess=[]
          for(let i =0;i<resp.length;i++){
            this.Currenciess[i]=resp[i].currency
          }
          console.log("currency",this.Currenciess)
          this.cuurency=null
          this.selectedRate=null

        },(err:any)=>{
          console.log("errrr",err)


        })
      }else {
        this.Currenciess=this.currencies
      }
      }
    this.input_currency = false

  }
  onSubmit(): void {
    console.log("test")
    if(this.meth==="Buy"){

    console.log("this.task",this.task)
    console.log("this.objWallet",this.objWallet)
    if(this.task==="CREATE" && this.objWallet===null ){
      if(this.form.get('input1')?.value!=0){
      let body={

        "currency":this.cuurency,

         "id_client":this.cookieservice.get("id"),
         "balance":this.form.get('input1')?.value,
        "rate":this.selectedRate
      }
      console.log("this.form.get('input1')?.value",this.form.get('input1')?.value)
        this.http.post('http://localhost:8081/ebank/api/v1/client/wallets/'+this.datas_CompteBancaire.id,body, {headers: this.headers}).
        subscribe((resp: any) => {
          this.cuurency=null
          this.datas_CompteBancaire=null
          this.account_number=null
          this.form.get('input1')?.setValue(0)
        },(err:any)=>{})
console.log("body",body)
      }

    }
    else{
      let body={

         'id_wallet':this.objWallet.id,
        "rate":this.selectedRate,
         'new_Balance':this.objWallet.balance+this.form.get('input1')?.value,

      }

      this.http.patch<any>('http://localhost:8081/ebank/api/v1/client/wallets/updateWallet',body, {headers: this.headers}).
      subscribe((resp: any) => {
        this.cuurency=null
        this.datas_CompteBancaire=null
        this.account_number=null
        this.form.get('input1')?.setValue(0)
      },(err:any)=>{})
      console.log("body",body)



    }
    }else{
      if(this.objWallet!==null){

          let body={

              'id_wallet':this.objWallet.id,
              "rate":this.selectedRate,
              'new_Balance':this.objWallet.balance-this.form.get('input1')?.value,

          }

          this.http.patch<any>('http://localhost:8081/ebank/api/v1/client/wallets/updateWallet',body, {headers: this.headers}).
          subscribe((resp: any) => {
              this.form.value.clear()
          },(err:any)=>{})
          console.log("body",body)




      }else{
        if(this.objWallet.balance==this.form.get('input1')?.value){}
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
      "id_client":parseInt(this.cookieservice.get('id')) ,
      "account_number":this.datas_CompteBancaire.account_number

    }

    this.http.post<any>('http://localhost:8081/ebank/api/v1/client/wallets/Bycurrency',body, {headers: this.headers})
      .subscribe((resp: any) => {
      console.log("resp===\"CREATE\"",resp==="CREATE")


        console.log("resp",resp)

         this.objWallet=resp
        this.task=""
        // this.task=resp

    },(err:any)=>{
        console.log("errrr",err)
        this.task=err.error.text
        this.objWallet=null

      })
  }
  valueInDinar:any=0
  valueIncurrency:any=0
  supthanbalance:boolean=false
  meth:any="Buy"

  h0(e:any){
    if(this.meth!==e){
      this.cuurency = null
      this.selectedRate = null
      this.objWallet=null
      this.datas_CompteBancaire=null
      this.account_number=null
      this.input_currency=true
      this.valueIncurrency=0
      this.supthanbalance=false
      this.form.get('input1')?.setValue(0)
    }
 this.meth=e
    if(this.meth==="Sell"){
      if(this.datas_CompteBancaire!==null){
        this.http.get<any>('http://localhost:8081/ebank/api/v1/client/wallets/allById_clientANDid_compte/'+this.cookieservice.get('id')+'/'+this.datas_CompteBancaire.id, {headers: this.headers})
            .subscribe((resp: any) => {
              this.Currenciess=[]
              for(let i =0;i<resp.length;i++){
                this.Currenciess[i]=resp[i].currency
              }
              console.log("currency",this.Currenciess)

            },(err:any)=>{
              console.log("errrr",err)


            })
      }else {
        this.Currenciess=this.currencies
      }
    }else{
      this.Currenciess=this.currencies
    }
  }
  h3(e:any){
    console.log('selectedRate',this.selectedRate)
    if(this.meth==="Buy"){


      this.valueInDinar= Math.floor(this.form.get('input1')?.value/this.selectedRate * 1000) / 1000
      if(this.valueInDinar>this.datas_CompteBancaire.balance) {
        this.supthanbalance=true
      }else{
        this.supthanbalance=false
      }
    }else{

      this.valueIncurrency= this.form.get('input1')?.value
      if(this.valueIncurrency>this.objWallet.balance) {
        this.supthanbalance=true
      }else{
        this.supthanbalance=false
      }
    }


    console.log(e)
    console.log(this.form.get('input1')?.value)
  }

  protected readonly Math = Math;
}
