import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CompteService } from '../Services/compte.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Compte_Bancaire } from '../Shared/Compte';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrls: ['./update-popup.component.css']
})
export class UpdatePopupComponent implements OnInit{

  constructor(private compteService: CompteService, @Inject(MAT_DIALOG_DATA) public data: any, private popup: MatDialog, private toastr: ToastrService) { }

  editObject: Compte_Bancaire;
  @ViewChild('updatePopupForm') form: NgForm;

  ngOnInit(): void {
    if (this.data.accountNumber != '' && this.data.accountNumber != null) {
      this.compteService.getOneCompte(this.data.accountNumber).subscribe((data)=>{
        this.editObject = data;
        console.log(this.editObject);

        this.form.setValue({
          id: this.editObject.id,
          accountNumber: this.editObject.accountNumber,
          balance: this.editObject.balance,
          opening_date: this.editObject.opening_date,
          account_type: this.editObject.account_type,
          closing_date: this.editObject.closing_date,
          interest_rate: this.editObject.interest_rate,
        })
      })
    }
  }

  onUpdate(compteObject: Compte_Bancaire){
    console.log(compteObject);
    this.compteService.updateCompte(compteObject).subscribe((res)=>{
      this.closePopup();
      this.toastr.success("Saved")
    },
    (error: any) => this.toastr.error("Error")
    )

  }

  closePopup() {
    this.popup.closeAll();
  }

}
