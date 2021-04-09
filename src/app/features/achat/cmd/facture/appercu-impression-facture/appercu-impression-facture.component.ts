import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as pdfmake from 'pdfmake';
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-appercu-impression-facture',
  templateUrl: './appercu-impression-facture.component.html',
  styleUrls: ['./appercu-impression-facture.component.scss']
})
export class AppercuImpressionFactureComponent implements OnInit {

  @ViewChild('span',{static:false}) span: ElementRef;

  FactureArticles=<any>[];
  articles=<any>[];//---
  oldnumbonsArr=<any>[];
  numBonsArr=<any>[];//---
  numBons:number=1;
  fournisseur:string;
  affFournisseur=true;
  source='';

  constructor(public dialogRef: MatDialogRef<AppercuImpressionFactureComponent> , @Inject(MAT_DIALOG_DATA) public data,
              private _router: Router) { }

  ngOnInit() {
    this.FactureArticles=this.data.data.FactureArticles ;
    this.articles=Object.values(this.FactureArticles);
    this.oldnumbonsArr=this.data.data.BonsIds ;
    this.numBonsArr=Object.values(this.oldnumbonsArr);
    this.fournisseur=this.data.data.nom;
    this.source=this.data.source;
  }

  

  CalculerTT(array){
   let TT = 0 ;
   for(let i=0;i<array.length;i++){
     TT = TT + ( array[i].QteBon * array[i].PrixHT ) ;
   }
   return TT;
  }

  totale(){
    let TT=0;
    for(let i=0;i<this.articles.length;i++){
      TT = TT +  this.CalculerTT(this.articles[i].ArrayQtePrix)  ;
    }
    return TT;
  }

  checkbox(){
    if(this.numBons==0){ this.numBons=1; }
    else{ this.numBons=0;}
  }
  
  checkboxFournisseur(){
    if(this.affFournisseur==false){ this.affFournisseur=true; }
    else{ this.affFournisseur=false;}
  }

  AfficherFacture(){
    this.dialogRef.close();
    this._router.navigate(['/achat/facture/facture/',this.data.data.FactureID]);
  }
  
  roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }

  
  
  downloadPDF(){
    const documentDefinition = { content:this.span.nativeElement.innerText };
    pdfmake.createPdf(documentDefinition).open();
  }



}
