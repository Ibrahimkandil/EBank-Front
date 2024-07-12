import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgenceService} from "../agence.service";

@Component({
  selector: 'app-edit-agence',
  templateUrl: './edit-agence.component.html',
  styleUrls: ['./edit-agence.component.css']
})
export class EditAgenceComponent {
  agenceForm: any;
  employes: any

  constructor(private snackBar: MatSnackBar, private cookieService: CookieService, private router: Router,
              private route: ActivatedRoute, private agenceService: AgenceService) {
    this.getbyId()
  }

  initForm(item: any) {
    console.log(item.name)
    this.agenceForm = new FormGroup({
      address: new FormControl(item?.address, Validators.required),
      responsable: new FormControl(item?.responsable?.name, Validators.required),
      phone: new FormControl(item?.phone, Validators.required),
      email: new FormControl(item?.email, Validators.required),
      postalCode: new FormControl(item?.postalCode, Validators.required),
      city: new FormControl(item?.city, Validators.required),
      country: new FormControl(item?.country, Validators.required),
      description: new FormControl('',),
      code: new FormControl(item?.code, Validators.required),
      state: new FormControl(true),
      creationDate: new FormControl(item?.creationDate, Validators.required),
      budget: new FormControl(item?.budget),
      name: new FormControl(item?.name, Validators.required),

    });
  }

  ngOnInit(): void {
    this.getAllEmploye()

  }


  putAgence() {

    this.route.paramMap.subscribe(params => {
      let json : any ={}
      json =this.agenceForm.value
      json["id"]=params.get('id')



      this.agenceService.putAgence(params.get('id'), this.agenceForm.value).subscribe(response => {

        this.snackBar.open("", 'Success', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5000, // duration in milliseconds (optional)
        });
        console.log('response', response);
        this.router.navigateByUrl("agence");
      }, err => {

        console.log(err);
        this.snackBar.open(err.toString(), 'Error', {
          duration: 5000, // duration in milliseconds (optional)
        });
      })
    })
  }

  getbyId() {
    this.route.paramMap.subscribe(params => {

      this.agenceService.getByIdAgence(params.get('id')).subscribe(response => {

        this.snackBar.open("", 'Success', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5000, // duration in milliseconds (optional)
        });
        this.initForm(response)
        console.log('response', response);
      }, err => {

        console.log(err);
        this.snackBar.open(err.toString(), 'Error', {
          duration: 5000, // duration in milliseconds (optional)
        });
      })
    })
  }

  getAllEmploye() {

    this.agenceService.getEmploye().subscribe(response => {
      this.employes = response
      this.snackBar.open("", 'Success', {
        duration: 5000, // duration in milliseconds (optional)
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      console.log('response', response);
    }, err => {

      console.log(err);
      this.snackBar.open(err.toString(), 'Error', {
        duration: 5000, // duration in milliseconds (optional)
      });
    })

  }
}
