import {Component} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie-service";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AgenceService} from "../agence.service";

@Component({
  selector: 'app-list-agence',
  templateUrl: './list-agence.component.html',
  styleUrls: ['./list-agence.component.css']
})
export class ListAgenceComponent {


  dataSourceOfAgence: any
  displayedColumns: string[] = [ 'name', 'address', 'phone', 'responsable', 'email', 'action'];

  constructor(private snackBar: MatSnackBar, private router: Router,
              private route: ActivatedRoute, private agenceService: AgenceService) {
    this.getAllAgence();
  }


  getAllAgence() {

    this.agenceService.getAgence().subscribe(response => {
      this.dataSourceOfAgence = response
      this.snackBar.open("", 'Success', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 5000, // duration in milliseconds (optional)
      });
      console.log('response', response);
    }, err => {

      console.log(err);
      this.snackBar.open(err.toString(), 'Error', {
        duration:2500// duration in milliseconds (optional)
      });
    })

  }

  addData() {
    this.router.navigate(['agence/Add'])
  }

  deleteAgence(e: any) {
    this.agenceService.deleteAgence(e.id).subscribe(response => {
      this.getAllAgence()

        this.snackBar.open("", 'Success', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration:2500
      });
      console.log('response', response);
      this.router.navigateByUrl("agence");
    }, err => {

      console.log(err);
      this.snackBar.open(err.toString(), 'Error', {
        duration: 5000, // duration in milliseconds (optional)
      });
    })

  }

  editAgence(e:any){
    this.router.navigate(['agence/edit/'+e.id])
  }
}
