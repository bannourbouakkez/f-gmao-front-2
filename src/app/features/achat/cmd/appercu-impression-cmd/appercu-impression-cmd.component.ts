import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfmake from 'pdfmake';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-appercu-impression-cmd',
  templateUrl: './appercu-impression-cmd.component.html',
  styleUrls: ['./appercu-impression-cmd.component.scss']
})
export class AppercuImpressionCmdComponent implements OnInit {
  @ViewChild('span',{static:false}) span: ElementRef;

  oldarticles=<any>[];
  articles=<any>[];
  oldnumCmdsArr=<any>[];
  numCmdsArr=<any>[];
  numCmds:number=1;
  fournisseur:string;
  affFournisseur=true;
  constructor(public dialogRef: MatDialogRef<AppercuImpressionCmdComponent> , @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    this.oldarticles=this.data.data.CmdArticles ;
    this.articles=Object.values(this.oldarticles);
    this.oldnumCmdsArr=this.data.data.CmdIds ;
    this.numCmdsArr=Object.values(this.oldnumCmdsArr);
    this.fournisseur=this.data.data.nom;
  }

  checkbox(){
    if(this.numCmds==0){ this.numCmds=1; }
    else{ this.numCmds=0;}
  }
  
  checkboxFournisseur(){
    if(this.affFournisseur==false){ this.affFournisseur=true; }
    else{ this.affFournisseur=false;}
  }

  
  roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }
  
  downloadPDF(){
    const documentDefinition = { content:this.span.nativeElement.innerText };
    pdfmake.createPdf(documentDefinition).open();
  }

}
