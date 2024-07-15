import { Component, OnInit } from '@angular/core';
import { CompteService } from '../Services/compte.service';
import { Router } from '@angular/router';
import { Compte_Bancaire } from '../Shared/Compte';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit{

  constructor(private compteService: CompteService, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {

  }

  CompteObject: Compte_Bancaire = {
    accountNumber: '',
    balance: 0,
    opening_date: new Date(),
    account_type: '',
    closing_date: new Date(),
    interest_rate: 0,
    client_id: 0,
  };

  onCreate(){
    this.CompteObject.opening_date.toISOString();
    this.CompteObject.closing_date.toISOString();
    this.compteService.addCompte(this.CompteObject).subscribe(
      (data)=> {
        if(data && Object.keys(data).length > 0){
          console.log(this.CompteObject)
          this.toastr.success("Saved")
          this.router.navigate(['interface1']);
        }
      },
      (error: any) => this.toastr.error("Error")
    )
  }
}

