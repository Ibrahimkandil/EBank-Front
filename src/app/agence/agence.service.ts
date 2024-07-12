import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class AgenceService {

  constructor(private cookieService:CookieService, private  http:HttpClient) { }
  postAgence(body:any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    return this.http.post<any>('http://localhost:8081/ebank/api/v1/Agences/add',body,{ headers: headers })
  }
  putAgence(id:any,body:any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    return this.http.put<any>('http://localhost:8081/ebank/api/v1/Agences/'+id,body,{ headers: headers })
  }
  getAgence(){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    return this.http.get<any>('http://localhost:8081/ebank/api/v1/Agences',{ headers: headers })
  }
  getEmploye(){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    return this.http.get<any>('http://localhost:8081/ebank/api/v1/employee/all',{ headers: headers })
  }

  deleteAgence(id:any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    return this.http.delete<any>('http://localhost:8081/ebank/api/v1/Agences/'+id,{ headers: headers })
  }



  getByIdAgence(id:any){
    const headers = new HttpHeaders({
      'Authorization': 'Bearer '+this.cookieService.get('token')
    });
    return this.http.get<any>('http://localhost:8081/ebank/api/v1/Agences/'+id,{ headers: headers })
  }
}
