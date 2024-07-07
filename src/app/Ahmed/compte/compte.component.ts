import { Component, OnInit } from '@angular/core';
import { CompteService } from '../Services/compte.service';
import { Router } from '@angular/router';
import { Compte_Bancaire } from '../Shared/Compte';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit{

  constructor(private compte: CompteService, private router: Router) {}

  ngOnInit(): void {

  }

  CompteObject: Compte_Bancaire = {
    account_number: '',
    balance: 0,
    opening_date: new Date(),
    account_type: '',
    closing_date: new Date(),
    interest_rate: 0,
    Date_d_ajout: new Date(),
    client_id: 0,
  };

  onCreate(){
    console.log(this.CompteObject);
  }

  OnModify(){

  }

}

