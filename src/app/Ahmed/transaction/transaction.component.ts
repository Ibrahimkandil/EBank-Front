import { Transaction } from './../Shared/Transaction';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../Services/transaction.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit{

  constructor(private transactionService: TransactionService, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {

  }

  TransactionObject: Transaction = {
    amount: 0,
    clientId: 0,
    type: '',
    Date_Expiration: new Date(),
  }

  onCreate(){
    this.TransactionObject.Date_Expiration.toISOString();
    this.transactionService.addTransaction(this.TransactionObject).subscribe(
      (data)=> {
        if(data && Object.keys(data).length > 0){
          this.toastr.success("Saved")
          this.router.navigate(['interface1']);
        }
      },
      (error: any) => this.toastr.error("error")
    )
  }

  };

