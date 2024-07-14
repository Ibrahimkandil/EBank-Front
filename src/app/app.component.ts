import {Component, HostListener} from '@angular/core';
import {FormControl,  FormGroup} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import { Router} from "@angular/router";
import {LoginControllerService} from "./authenticate/login-controller.service";
import {CookiesGestionnaireService} from "./authenticate/CookiesGestionnaire.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SendEmailDialogComponent} from "./authenticate/send-email-dialog/send-email-dialog.component";
import {CreationComponent} from "./authenticate/creation/creation.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   screenWidth = window.innerWidth;
   orgscreenWidth = window.screen.availWidth;
  nav:boolean=false;
  title = 'E-Bank';
  signinForm:any=new FormGroup({
  a : new FormControl(null)
})
  display_menu : boolean=false;
  currentUrl: string = window.location.href;
  constructor(public dialog: MatDialog,
      public cookieGestionnaireService:CookiesGestionnaireService,
      private LoginControllerService:LoginControllerService,
      public CookieService:CookieService,
      private router:Router

  ) {
    if(this.CookieService.get('etat')==="VERIFICATION"){
      this.openConfirmation()
    }

    window.addEventListener('resize', this.onResize.bind(this));


  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;

  }
  toggleNav(){
    this.nav=!this.nav;

  }
  logout() {
    this.cookieGestionnaireService.clearCookies();
    this.router.navigateByUrl("auth");
  }

  redirectversForm(link: string) {
    // Navigate to a dummy route first
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      // Then navigate to the desired route and reload the page
      this.router.navigate([`/${link}`]).then(() => {
        window.location.reload();
      });
    });
  }
  // redirectversForm(link:string){
  //   this.router.navigate([`/${link}`])
  //
  //   window.location.reload();
  // }
  openConfirmation(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; // Prevents closing the dialog by clicking outside of it

    dialogConfig.width = '1000px'; // Adjust width as needed
    dialogConfig.height = '500px'; // Adjust height as needed
    const dialogRef = this.dialog.open(CreationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle actions after the dialog is closed, if needed
    });
  }


  protected readonly window = window;
}
