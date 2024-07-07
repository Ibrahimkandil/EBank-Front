import { Component, OnInit } from '@angular/core';
import { TransfertService } from '../Services/transfert.service';
import { Router } from '@angular/router';
import { Transfert } from '../Shared/Transfert';

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.css']
})
export class TransfertComponent implements OnInit{

  constructor(private transfert: TransfertService, private router: Router) {}

  ngOnInit(): void {

  }

  TransfertObject: Transfert = {
    amount: 0,
    Date: new Date(),
    idCompteSource: 0,
    idCompteDestinations: 0
  };

  onCreate(){
    console.log(this.TransfertObject);
  }

}

