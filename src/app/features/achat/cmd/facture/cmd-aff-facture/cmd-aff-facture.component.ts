import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FactureService } from '../../services/facture.service';
import { AppercuImpressionFactureComponent } from '../appercu-impression-facture/appercu-impression-facture.component';
import { CmdAffBonComponent } from '../../cmd-aff-bon/cmd-aff-bon.component';

@Component({
  selector: 'app-cmd-aff-facture',
  templateUrl: './cmd-aff-facture.component.html',
  styleUrls: ['./cmd-aff-facture.component.scss']
})
export class CmdAffFactureComponent implements OnInit {

  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/achat/cmd/receptions/liste',title:'Liste bons'},
    {url:'gmao/achat/facture/all/0',title:'Liste factures'}
   ];

   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/facture',title:'facture'},
    {url:'',title:'Afficher facture'}
  ];

lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
//###############################
isData=false;
loaded=false;
LoadingReactBtn1=false;

  FactureID:number=0;
  response=false;
  canRestaured=false;
  result:any;
  nom:string;
  FournisseurID=0;
  BonsIds=<any>[];
  FactureArticles=<any>[];
  articles=<any>[];
  Facture:any;
  
  constructor(private _currentRoute: ActivatedRoute,private dialog: MatDialog,private factureService:FactureService) { }
  
  ngOnInit(){
    let FactureID = +this._currentRoute.snapshot.paramMap.get('id');
    if(FactureID>0){
      this.FactureID=FactureID;
      this.getFacture(FactureID);
    }
  }

  getFacture(FactureID:number){
    this.factureService.getFacture(FactureID).then(
      res=>{
        //http://localhost:4200/achat/facture/facture/2
        console.log(res);
        
        
        this.FournisseurID=res.FournisseurID;
        this.nom=res.nom;
        this.BonsIds=res.BonsIds;
        this.Facture=res.Facture;
        this.response=true;
        this.canRestaured=res.canRestaured;
        this.FactureArticles=res.FactureArticles;
        this.articles=Object.values(this.FactureArticles);
        this.result=res;

        this.loaded=true;
      },
      err=>console.log('CmdAffFactureComponent:getFacture',err)
    );
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

   roundMath(value){
    return (Math.round(value * 1000000)/1000000);
    }


    openDialog(){
      const dialogRef = this.dialog.open(AppercuImpressionFactureComponent, {
        width: '90%',
        data: {data:this.result,source:'CmdAffFactureComponent'}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('ipression done ');
      });
    }

    suprimerFacture(){
    
     if(!this.LoadingReactBtn1){
       this.LoadingReactBtn1=true;
     this.factureService.suprimerFacture(this.FactureID).then(
       res=>{

         this.LoadingReactBtn1=false;
         this.loaded=false;
         this.ngOnInit();

         //console.log(res);

        },
       err=>console.log('CmdAffFactureComponent:suprimerFacture',err)
     );
     }
    }

    restaurerFacture(){
      if(!this.LoadingReactBtn1){
        this.LoadingReactBtn1=true;
      this.factureService.restaurerFacture(this.FactureID).then(
        res=>{
          this.LoadingReactBtn1=false;
          this.loaded=false;
          this.ngOnInit();
          //console.log(res);
        },
        err=>console.log('CmdAffFactureComponent:restaurerFacture',err)
      );
      }
    }




    openBon(BonID){
      const dialogConfig = new MatDialogConfig();
          dialogConfig.panelClass="custom-dialog-container";
          dialogConfig.autoFocus = true;
          dialogConfig.width = "80%";
          dialogConfig.data={BonID};
          this.dialog.open(CmdAffBonComponent, dialogConfig)
          .afterClosed().subscribe( res=> {
          });
    }


}
