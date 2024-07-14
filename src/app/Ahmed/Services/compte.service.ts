import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Compte_Bancaire } from '../Shared/Compte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  addCompte(compte: Compte_Bancaire): Observable<Compte_Bancaire>{
    return this.http.post<Compte_Bancaire>(`${this.apiUrl}/Comptes/add`, compte);
  }

  getAllComptes(): Observable<Compte_Bancaire[]>{
    return this.http.get<Compte_Bancaire[]>(`${this.apiUrl}/Comptes/get`);
  }

  getOneCompte(accountNumber: string): Observable<Compte_Bancaire>{
    return this.http.get<Compte_Bancaire>(`${this.apiUrl}/Comptes/get/${accountNumber}`);
  }

  updateCompte(compte: Compte_Bancaire): Observable<Compte_Bancaire>{
    return this.http.put<Compte_Bancaire>(`${this.apiUrl}/Comptes/update/${compte.id}`, compte);
  }

  deleteCompte(accountNumber: string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/Comptes/delete/${accountNumber}`);
  }


}
