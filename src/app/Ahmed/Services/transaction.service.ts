import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaction } from '../Shared/Transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl;

  addTransaction(transaction: Transaction): Observable<Transaction>{
    return this.http.post<Transaction>(`${this.apiUrl}/Transactions/add`, transaction);
  }

  getOneTransaction(id: number): Observable<Transaction>{
    return this.http.get<Transaction>(`${this.apiUrl}/Transactions/get/${id}`);
  }

  getAllTransactionsByUser(id: number): Observable<Transaction[]>{
    return this.http.get<Transaction[]>(`${this.apiUrl}/Transactions/getAll/${id}`);
  }

  getAllTransactions(): Observable<Transaction[]>{
    return this.http.get<Transaction[]>(`${this.apiUrl}/Transactions/get`);
  }


}
