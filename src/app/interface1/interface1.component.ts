import {Component, OnInit} from '@angular/core';
import {LoginControllerService} from "../authenticate/login-controller.service";
import { Chart } from 'chart.js';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-interface1',
  templateUrl: './interface1.component.html',
  styleUrls: ['./interface1.component.css']
})
export class Interface1Component implements OnInit{
  pieChart: any;
  historiques:any;
  transaction:any;
  transfert:any;
  comptes:any;
  listofbunch:any=[]
  listdesComptes:any=[]


  constructor(
      private LoginControllerService:LoginControllerService,
      private http:HttpClient,
      private cookieservice:CookieService,
      private snackBar: MatSnackBar,
      private router:Router
  ) {
    console.log("this.cookieservice.get('menus')",this.cookieservice.get('menus'))



    this.LoginControllerService.check_login("client");
    console.log("this.cookieservice.get('type')===\"Employee\"",this.cookieservice.get('type')==="Employee")
    console.log("this.cookieservice.get('type')===\"Client\"",this.cookieservice.get('type')==="Client")
     //
     // if(this.cookieservice.get('type')==="Employee"){
     //   console.log('true')
     //   this.router.navigateByUrl('/interface2');
     // }
     //    this.router.navigate(['interface2']);
     // }
    //   this.router.navigate(['/interface2']);
    //
    // }
    // if(this.cookieservice.get('type')!=="Client"){
    //   if(this.cookieservice.get('type')==="Employee"){
    //     this.router.navigate(['/interface2']);
    //   }else{
    //   }
    // }
    this.getNotification()
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieservice.get('token')
    });
    this.http.get('http://localhost:8081/ebank/api/v1/client/historiques/'+this.cookieservice.get('id'), {headers: headers}).
    subscribe((res: any) => {
      this.historiques=res;
      console.log("this.historiques",this.historiques)
      this.snackBar.open("Succefull fetching Historiques", 'Success', {
        duration: 5000, // duration in milliseconds (optional)

      });
      this.http.get('http://localhost:8081/ebank/api/v1/client/comptes/'+this.cookieservice.get('id'), {headers: headers}).
      subscribe((resp: any) => {
        this.comptes=resp;
        this.snackBar.open(resp, 'Success fetching les comptes Bancaires', {
          duration: 5000,
        });
        this.transaction=this.historiques[0]
        this.listdesComptes=this.fetch_CompteNumber(this.transaction)
        console.log("this.listdesComptes",this.listdesComptes)
        let transactionByCompteNumber=this.TransactionByCompteNumber(this.transaction,this.listdesComptes[0])
        this.fetchfive(this.listofbunch,transactionByCompteNumber)
        this.transfert=this.historiques[1]
        let depot =this.filterByType(transactionByCompteNumber,"DEPOSIT")
        let withdraw =this.filterByType(transactionByCompteNumber,"WITHDRAWAL")
        let total=this.comptes[0].balance;
        let totwith=0
        totwith=this.calcDepense(withdraw)
        console.log("historique",this.historiques[1])
        totwith=totwith+this.calcDepense(this.historiques[1])
        // this.compareDate(this.historiques[0][4]['date_Expiration'])
        this.Create_PieChart(totwith,total)
      }, (err: any) => {})
    }, (err: any) => {})


  }
  ngOnInit() {
  }

  Create_PieChart(v1:number,v2:number){
    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Dépense', 'Solde'],
        datasets: [{
          data: [v1,v2], // Your data values
          backgroundColor: ['#FF6384', '#FFCE56'] // Colors for each slice
        }]
      }
    });
  }
  compareDate(date: string): boolean {
    let currentDate = new Date();
    let inputDate = new Date(date);
    return inputDate > currentDate;
  }
  TransactionByCompteNumber(transaction:any,compteNumber:string):any{
    return transaction.filter((element:any) => element.compte_Bancaire.account_number === compteNumber)
  }


  h1(e:any){
    let transactionByCompteNumber=this.TransactionByCompteNumber(this.transaction,e)
    this.listofbunch=[]
    this.fetchfive(this.listofbunch,transactionByCompteNumber)
    let depot =this.filterByType(transactionByCompteNumber,"DEPOSIT")
    let withdraw =this.filterByType(transactionByCompteNumber,"WITHDRAWAL")
    let total=this.comptes.find((i:any)=>i['account_number']===e).balance;
    let totwith=0
    totwith=this.calcDepense(withdraw)

    this.Create_PieChart(totwith,total)

  }

  fetchfive(tablefive:any,fulltab:any){
    // tablefive=[]
    let limite=5

    if(fulltab.length<5){
      limite=fulltab.length
    }else {
      limite=5
    }
    let i =0
    while (i<limite){
      tablefive[i]=fulltab[i]
      i=i+1
    }


  }
filterByType(historique:any,type:String):any{
  return historique.filter((element:any) => element.type===type)

}
calcDepense(withdraw:any):number{
  let totwith=0

  for(let i=0;i< withdraw.length;i++){
    totwith=totwith+withdraw[i].amount
  }
  return totwith
}
fetch_CompteNumber(transaction:any):any{
  let seenAccountNumbers = new Set<string>();
  let listdesComptes:any=[]

  this.transaction.forEach((element: any) => {
    let accountNumber = element.compte_Bancaire.account_number;

    // Check if the account number hasn't been added already
    if (!seenAccountNumbers.has(accountNumber)) {
      listdesComptes.push(accountNumber); // Add unique account number to the array
      seenAccountNumbers.add(accountNumber); // Add to the Set to track uniqueness
    }
  });
  return listdesComptes
}
demandeContrat:any=[]
  reclamations :any=[]
getNotification(){
  const headers = new HttpHeaders({
    'Authorization': 'Bearer '+this.cookieservice.get('token')
  });
    this.http.get('http://localhost:8081/ebank/api/v1/client/notifications/'+this.cookieservice.get('id'), {headers: headers})
        .subscribe((res: any) => {
          this.reclamations=res[2]

          res[1].forEach((contrat:any) => {
            // Find the corresponding demande
            let matchingDemande =  res[0].find((demande:any) => demande.id === contrat.demande.id);

            if (matchingDemande) {
              // Update etat to "validated" for this contrat
              contrat.etat = "validated";
            }else{
                contrat.etat = "En attente";
            }
          });
          res[0].forEach((ele:any,i:number)=>{
            this.demandeContrat[i]=ele
          })
          res[1].forEach((ele:any,i:number)=>{
            this.demandeContrat[ this.demandeContrat.length+i]=ele
          })


          this.demandeContrat.forEach((ele: any) => {
            if (ele.typeObj !== undefined) {
              ele.etat = "validated"; // Corrected spelling from "valideted" to "validated"
            }
          });


          console.log("this.demandeContrat",this.demandeContrat)
          console.log("this.reclamations",this.reclamations)
        }, (err: any) => {})
}
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1); // Months are zero indexed
    const day = this.padNumber(date.getDate());
    return `${year}-${month}-${day}`;
  }
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}
