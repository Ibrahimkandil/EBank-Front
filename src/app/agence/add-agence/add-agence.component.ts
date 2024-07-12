import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AgenceService } from '../agence.service';

@Component({
  selector: 'app-add-agence',
  templateUrl: './add-agence.component.html',
  styleUrls: ['./add-agence.component.css']
})
export class AddAgenceComponent implements OnInit {
  agenceForm: FormGroup;
  employes: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private agenceService: AgenceService
  ) {
    this.agenceForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      responsable: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Added pattern validation for phone numbers
      email: ['', [Validators.required, Validators.email]],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      description: [''],
      code: ['', Validators.required],
      state: [true, Validators.required],
      creationDate: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]], // Ensured budget is non-negative
    });
  }

  ngOnInit(): void {
    this.getAllEmploye();
  }

  onSubmit() {
    if (this.agenceForm.valid) {
      this.postAgence();
    } else {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Erreur', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  postAgence() {
    this.agenceService.postAgence(this.agenceForm.value).subscribe(
      response => {
        this.snackBar.open('Agence créée avec succès', 'Succès', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5000,
        });
        this.router.navigateByUrl('/agence');
      },
      err => {
        this.snackBar.open('Erreur lors de la création de l\'agence', 'Erreur', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    );
  }

  getAllEmploye() {
    this.agenceService.getEmploye().subscribe(
      response => {
        this.employes = response;
        this.snackBar.open('Employés récupérés avec succès', 'Succès', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5000,
        });
      },
      err => {
        this.snackBar.open('Erreur lors de la récupération des employés', 'Erreur', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    );
  }
}
