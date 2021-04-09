import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfmake from 'pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-appercu-impression-reception',
  templateUrl: './appercu-impression-reception.component.html',
  styleUrls: ['./appercu-impression-reception.component.scss']
})
export class AppercuImpressionReceptionComponent implements OnInit {

  @ViewChild('imprimer',{static:false}) imprimer: ElementRef;
  reception;
  reception_det=[];
  constructor(public dialogRef: MatDialogRef<AppercuImpressionReceptionComponent> , @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
   
    this.reception=this.data.data.reception;
    this.reception_det=Object.values(this.data.data.reception_det);

  }

  roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }

    downloadPDF(){
      const documentDefinition = { content:this.imprimer.nativeElement.innerText };
      pdfmake.createPdf(documentDefinition).open();
    }

}
