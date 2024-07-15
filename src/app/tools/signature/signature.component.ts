import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import SignaturePad from "signature_pad";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {Packer, Document, Paragraph, TextRun, ImageRun} from 'docx';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';

import * as fs from "fs";


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement> | any;
  signaturePad:any |SignaturePad;
  pdfMake: any = pdfMake;

  @Output() imageDataChange = new EventEmitter<any>(); // Define Output with EventEmitter

  // Method to emit imageData to parent component
  ImageData:any

  emitImageData() {
    if(!this.signaturePad.isEmpty()){
    this.ImageData = this.signaturePad.toDataURL();
    this.imageDataChange.emit(this.ImageData);
    }
  }

  constructor() {

    this.pdfMake.vfs = pdfFonts.pdfMake.vfs ;
  }


  ngOnInit() {
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
  }

  saveSignatureAsPNG() {
    const dataUrl = this.signaturePad.toDataURL();
    this.ImageData = this.signaturePad.toDataURL();
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'signature.png';
    downloadLink.click();


  }

  saveSignatureAsJPEG(quality: number = 0.5) {
    const dataUrl = this.signaturePad.toDataURL('image/jpeg');
    this.ImageData = this.signaturePad.toDataURL();
    const blob = this.dataURLToBlob(dataUrl);
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'signature.jpeg'; // Change the extension to jpg
    downloadLink.click();
    URL.revokeObjectURL(url); // Clean up the URL object to release memory
  }


  saveSignatureAsSVG(includeBackgroundColor: boolean = false) {
    const svgData = this.signaturePad.toSVG({ includeBackgroundColor });
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'signature.svg';
    downloadLink.click();
    URL.revokeObjectURL(url); // Clean up the URL object to release memory
  }

  dataURLToBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: 'image/png' }); // Change the type if needed
  }
  drawSignatureFromDataURL(dataUrl: string, options?: any) {
    this.signaturePad.fromDataURL(dataUrl, options);
  }

  drawSignatureFromData(data: any[], options?: any) {
    this.signaturePad.fromData(data, options);
  }

  clearCanvas() {
    this.signaturePad.clear();
  }

  isCanvasEmpty() {
    this.ImageData = this.signaturePad.toDataURL();
    return this.signaturePad.isEmpty();

  }

  unbindEventHandlers() {
    this.signaturePad.off();
  }

  rebindEventHandlers() {
    this.signaturePad.on();
  }
content="Welcome Mr/Mrs\n" +
    "Here is Your Idnetification \n" +
    "Thank you for using our service\n" +
    "Please Enjoy them :)"
  Insertpdf(){
    const dataUrl = this.signaturePad.toDataURL();
    const content = 'This is the content of the document.';
    const signatureUrl = dataUrl;
    this.generatePDF( content,signatureUrl);

  }
  Insertdocx(){
    const dataUrl = this.signaturePad.toDataURL();
    const content = 'This is the content of the document.';
    const signatureUrl = dataUrl;

    this.generateDOCX(content, signatureUrl);

  }




  private generatePDF(content: string, signatureDataUrl: string) {

    const docDefinition = {
      content: [
        { text: 'Document Content:', fontSize: 16 },
        { text: content, fontSize: 12 },
        { text: "" + "" + "", fontSize: 12 },
        { image: signatureDataUrl, width: 600, height: 400 } // Insert signature as an image
      ]
    };

    // const pdfDoc = pdfMake.createPdf(docDefinition);
    // pdfDoc.getBlob((blob: Blob) => {
    //   saveAs(blob, 'document.pdf');
    // });
  }
  private generateDOCX(content: string, signatureDataUrl: string) {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(content),
                new TextRun({
                  break: 1
                }),
                new TextRun({
                  text: 'Signature:',
                  bold: true
                }),
                new TextRun({
                  break: 1
                }),
                new TextRun({
                  text: 'Signature Image URL:',
                  bold: true
                }),
                new TextRun({
                  break: 1
                }),

                new ImageRun({
                  data:signatureDataUrl,
                  transformation: {width: 600, height: 400}

                })
              ]
            })
          ]
        }
      ]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'document.docx');
    });
  }

  // private generateDOCX(content: string, signatureDataUrl: string) {
  //   const doc = new Document();
  //   doc.addSection({
  //     children: [
  //       new Paragraph({
  //         children: [
  //           new TextRun(content),
  //           new TextRun({
  //             break: 1
  //           }),
  //           new TextRun({
  //             text: 'Signature:',
  //             bold: true
  //           }),
  //           new TextRun({
  //             break: 1
  //           }),
  //           new TextRun({
  //             text: 'Signature Image:',
  //             bold: true
  //           }),
  //           new TextRun({
  //             break: 1
  //           }),
  //           new TextRun({
  //             text: signatureDataUrl,
  //             hyperlink: signatureDataUrl // Insert signature as a hyperlink
  //           })
  //         ]
  //       })
  //     ]
  //   });
  //
  //   Packer.toBlob(doc).then(blob => {
  //     saveAs(blob, 'document.docx');
  //   });
  // }

}
