import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  List_Input=[]
  Client_Input= [
      "last_name",
      "first_name",
      "address",
      "phone",
      "email",
      "date_of_birth",
      "sexe",
      "etatCivil",
      "statutEmploi",
      "image_data",

  ]
  Employee_Input= [
    "name",
    "mail",
    "address",
    "cin",
    "last_name",
    "sexe",
    "image_data",

  ]

  Admin_Input=[

    "name",
    "last_name",
    "sexe",
    "image_data",

  ]
  constructor() {
  }
}
