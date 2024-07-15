import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class WalletDashboardService {


  currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD'];

  public facteur=[0.051 ,-0.06,0.071,0.032,0]
  public facteurheure=[0.049 ,-0.07,0.070,0.033,0]




  constructor(private cookieService: CookieService,
              private cookieservice:CookieService,
    private http :HttpClient) {

  }


  fetchWallets(){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
     return this.http.get('http://localhost:8081/ebank/api/v1/client/wallets/all/'+this.cookieService.get('id'),{ headers: headers })
  }


}
