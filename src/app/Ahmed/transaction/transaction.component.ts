import { Transaction } from './../Shared/Transaction';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../Services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit{

  constructor(private transaction: TransactionService, private router: Router) {}

  ngOnInit(): void {

  }

  TransactionObject: Transaction = {
    amount: 0,
    clientId: 0,
    type: '',
    Date_Expiration: new Date(),
  }

  onCreate(){
    console.log(this.TransactionObject);
  }

  };

