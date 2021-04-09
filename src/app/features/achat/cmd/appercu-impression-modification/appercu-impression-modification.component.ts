import { Component, OnInit , ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfmake from 'pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-appercu-impression-modification',
  templateUrl: './appercu-impression-modification.component.html',
  styleUrls: ['./appercu-impression-modification.component.scss']
})
export class AppercuImpressionModificationComponent implements OnInit {

  @ViewChild('imprimer',{static:false}) imprimer: ElementRef;
  modification;
  modification_det=[];
  constructor(public dialogRef: MatDialogRef<AppercuImpressionModificationComponent> , @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    this.modification=this.data.data.modification;
    this.modification_det=Object.values(this.data.data.modification_det);
  }

  roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }

    downloadPDF(){
      const documentDefinition = { content:this.imprimer.nativeElement.innerText };
      pdfmake.createPdf(documentDefinition).open();
    }
    

}
