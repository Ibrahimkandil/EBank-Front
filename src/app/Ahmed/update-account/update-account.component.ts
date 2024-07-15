import { Component, OnInit } from '@angular/core';
import { CompteService } from '../Services/compte.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePopupComponent } from '../update-popup/update-popup.component';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.css']
})
export class UpdateAccountComponent{

  constructor(private compteService: CompteService, private router: Router,private toastr: ToastrService,private popup: MatDialog) {}

  CompteObject = {
    accountNumber : '',
  };

  openPopup(accountNumber: any){
    const _popup = this.popup.open(UpdatePopupComponent,{
      width: '500px',
      data:{
        accountNumber:accountNumber
      }
    });

    _popup.afterClosed().subscribe(r => {
      this.router.navigate(['interface1']);
    });

  };

  onUpdate(){
    this.openPopup(this.CompteObject.accountNumber)
  };
}
