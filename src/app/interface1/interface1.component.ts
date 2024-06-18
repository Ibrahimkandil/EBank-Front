import { Component } from '@angular/core';
import {LoginControllerService} from "../authenticate/login-controller.service";

@Component({
  selector: 'app-interface1',
  templateUrl: './interface1.component.html',
  styleUrls: ['./interface1.component.css']
})
export class Interface1Component {
  constructor(
      private LoginControllerService:LoginControllerService
  ) {
    this.LoginControllerService.check_login();
  }

}
