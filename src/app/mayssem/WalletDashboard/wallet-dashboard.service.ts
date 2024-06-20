import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WalletDashboardService {
   public datasources = [{
    id: 1,
    name: 'Wallet 1',
    balance: 1000,
    currency: 'USD',


  },
     {
       id: 1,
       name: 'Wallet 1',
       balance: 1000,
       currency: 'USD',

     },
     {
     id: 1,
  name: 'Wallet 1',
  balance: 1000,
  currency: 'USD'
     }]

  constructor(private http :HttpClient) {
  }


  fetchWallets(){
     return this.http.get('https://localhost:8081/ebank/api/v1/client/wallets')
  }

}
