import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent {
  constructor( @Inject(MAT_DIALOG_DATA) public data: { data: string },
               public dialogRef: MatDialogRef<QrcodeComponent>,
  ) {
  }

  dataToEncode: string = '';
  qrCodeValue: string =  this.data.data.trim();

  generateQRCode() {
    this.qrCodeValue = this.data.data.trim();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }

}
