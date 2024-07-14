import { Component, OnInit } from '@angular/core';
import { CompteService } from '../Services/compte.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit{

  constructor(private compteService: CompteService, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {

  }

  CompteObject = {
    accountNumber: '',
  };

  onDelete(){
    this.compteService.deleteCompte(this.CompteObject.accountNumber).subscribe(
      (res)=> {
        this.toastr.success("Saved")
        this.router.navigate(['interface1']);
      }

    )
  }

}
