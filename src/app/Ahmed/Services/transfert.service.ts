import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transfert } from '../Shared/Transfert';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransfertService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  addTransfert(transfert: Transfert): Observable<Transfert>{
    return this.http.post<Transfert>(`${this.apiUrl}/Transferts/add`, transfert);
  }

  getOneTransfert(id: number): Observable<Transfert>{
    return this.http.get<Transfert>(`${this.apiUrl}/Transferts/get/${id}`);
  }

  getAllTransfertsByUser(id: number): Observable<Transfert[]>{
    return this.http.get<Transfert[]>(`${this.apiUrl}/Transferts/getAll/${id}`);
  }

  getAllTransferts(): Observable<Transfert[]>{
    return this.http.get<Transfert[]>(`${this.apiUrl}/Transferts/get`);
  }
}
