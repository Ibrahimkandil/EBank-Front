import { Component, OnInit } from '@angular/core';
import { TransfertService } from '../Services/transfert.service';
import { Router } from '@angular/router';
import { Transfert } from '../Shared/Transfert';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfert',
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.css']
})
export class TransfertComponent implements OnInit{

  constructor(private transfertService: TransfertService, private router: Router,private toastr: ToastrService) {}

  ngOnInit(): void {

  }

  TransfertObject: Transfert = {
    amount: 0,
    Date: new Date(),
    idCompteSource: 0,
    idCompteDestinations: 0
  };

  onCreate(){
    this.TransfertObject.Date.toISOString();
    console.log(this.TransfertObject);
    this.transfertService.addTransfert(this.TransfertObject).subscribe(
      (data)=> {
        if(data && Object.keys(data).length > 0){
          this.toastr.success("Saved")
          this.router.navigate(['interface1']);
        }
      },
      (error: any) => this.toastr.error("error")
    )
  }

}

