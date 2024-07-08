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



          this.objWallet=resp
          // this.task=resp

        },(err:any)=>{
          console.log("errrr",err)
          this.task=err.error.text

        })
    this.input_Compte=false

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

    if(this.meth==="Buy") {



      let body = {
        "currency": this.cuurency,
        "id_client": parseInt(this.cookieservice.get('id')),
        "account_number": this.datas_CompteBancaire.account_number

      }
      this.http.post<any>('http://localhost:8081/ebank/api/v1/client/wallets/Bycurrency',body, {headers: this.headers})
          .subscribe((resp: any) => {




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
    if(this.meth==="Buy"){


    if(this.task==="CREATE" && this.objWallet===null ){
      if(this.form.get('input1')?.value!=0){
      let body={

        "currency":this.cuurency,

         "id_client":this.cookieservice.get("id"),
         "balance":this.form.get('input1')?.value,
        "rate":this.selectedRate
      }
        this.http.post('http://localhost:8081/ebank/api/v1/client/wallets/'+this.datas_CompteBancaire.id,body, {headers: this.headers}).
        subscribe((resp: any) => {
          this.cuurency=null
          this.datas_CompteBancaire=null
          this.account_number=null
          this.form.get('input1')?.setValue(0)
        },(err:any)=>{})
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
      },(err:any)=>{
        console.log("err",err)
      })



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




      }else{
        if(this.objWallet.balance==this.form.get('input1')?.value){}
      }


    }

  }
  getExchangeRates(): Observable<any> {
    let url=`https://api.exchangerate-api.com/v4/latest/TND`
    return this.http.get<any>(url);
  }

  ngAfterViewInit() {

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

    this.cuurency=e
    this.selectedRate=this.rates[`${e}`]
    let body={
      "currency":e,
      "id_client":parseInt(this.cookieservice.get('id')) ,
      "account_number":this.datas_CompteBancaire.account_number

    }

    this.http.post<any>('http://localhost:8081/ebank/api/v1/client/wallets/Bycurrency',body, {headers: this.headers})
      .subscribe((resp: any) => {



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





  }

  protected readonly Math = Math;
}
