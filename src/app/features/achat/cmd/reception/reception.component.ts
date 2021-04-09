import { Component, OnInit } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../interfaces/article';
import { AppercuImpressionReceptionComponent } from '../appercu-impression-reception/appercu-impression-reception.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CmdAffRetourComponent } from '../retour/cmd-aff-retour/cmd-aff-retour.component';
import { CmdAffBonComponent } from '../cmd-aff-bon/cmd-aff-bon.component';
import { CmdReceptionModifComponent } from '../cmd-reception-modif/cmd-reception-modif.component';

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss']
})
export class ReceptionComponent implements OnInit {

    //---------- breadcrumb ---------
    autres=[ 
      {url:'gmao/achat/cmd/receptions/liste',title:"Liste receptions"}
    ];
    breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/achat',title:'achat'} ,
      {url:'gmao/achat/reception',title:"reception"},
      {url:'',title:"reception"}
    ];
    lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
    isData=false;
    btnClicked=false;
    //################################

  receptionLoaded=false;
  modifLoaded=false;
  bonLoaded=false;
  CmdRecID:number=0;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    console.log(id);
    if (checked) {
      this.expandSet.add(id);
      
    } else {
      this.expandSet.delete(id);
    }
  }


  getReceptionRes=false;
  getReceptionModifsRes=false;
  reception: any;
  receptiondet=[];
  receptiondetsomme=[];
  receptionmodifs=[];
  bon:any;
  retours=[];

  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,public dialog: MatDialog
    ,private matDialog: MatDialog) { }

  ngOnInit() {
    let CmdRecID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CmdRecID>0){ // nthabbit yatla3ch null zeda normalement 
      this.CmdRecID=CmdRecID;
      this.getReception(CmdRecID);
      this.getReceptionModifs(CmdRecID);
      this.getBon(CmdRecID);
    }
  }


  getReception(CmdRecID:number){
    this.cmdService.getReception(CmdRecID).then(
      res=>{
        this.getReceptionRes=true;
        this.reception=res.reception;
        this.retours=res.Retours;
        this.receptiondet=res.reception_det;
        this.receptiondetsomme=this.somme();
        
        this.receptionLoaded=true;
      },
      err=>console.log('ReceptionComponent:getReception:',err)
    )
  }

  getReceptionModifs(CmdRecID:number){
    this.cmdService.getReceptionModifs(CmdRecID).then(
      res=>{
        this.receptionmodifs=res;
        this.modifLoaded=true;
      },
      err=>console.log('ReceptionComponent:getReceptionModifs:',err)
    )
  }

  getBon(CmdRecID:number){
    this.cmdService.getBonByCmdRecID(CmdRecID).then(
      res=>{
        this.bon=res.bon;
        this.bonLoaded=true;
      },
      err=>console.log('ReceptionComponent:getBon:',err)
    )
  }
  
  openRetour(RetourID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={RetourID};
        this.matDialog.open(CmdAffRetourComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='delete'){
              this.retours = this.retours.filter(d => d.RetourID !== RetourID);
          }
        });
  }


  openBon(BonID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BonID};
        this.matDialog.open(CmdAffBonComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='delete'){
            this.bon=null;
              //this.bons= this.bons.filter(d => d.BonID !== BonID);

              //this.reception.BonID=null;
              /*
              for(let i=0; i<this.receptions.length ; i++){
                 if(this.receptions[i].CmdRecID==CmdRecID){
                  this.receptions[i].BonID=null;
                 }
              }
              */
          }
        });
  }

  openModif(CmdRecModifID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={CmdRecModifID};
        this.matDialog.open(CmdReceptionModifComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          //if(res=='delete'){
              //this.bon=null;
              //this.bons= this.bons.filter(d => d.BonID !== BonID);

              //this.reception.BonID=null;
              /*
              for(let i=0; i<this.receptions.length ; i++){
                 if(this.receptions[i].CmdRecID==CmdRecID){
                  this.receptions[i].BonID=null;
                 }
              }
              */
          //}
        });
  }



  somme(){
    let somme:Article[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.receptiondet.length; i++ ) {
     let article_id = this.receptiondet[i].ArticleID;
     if(somme[article_id]){
     somme[article_id].Des=this.receptiondet[i].des;
     somme[article_id].TTQteCmde+=this.receptiondet[i].qte;
     somme[article_id].TTQteRecu+=this.receptiondet[i].QteRecu;
     }else{
       somme[article_id]={Des:this.receptiondet[i].des,TTQteCmde:this.receptiondet[i].qte,TTQteRecu:this.receptiondet[i].QteRecu};
     }
    }
    var j=0;
    for (var i = 0;  i<somme.length; i++ ) {
     if(somme[i]){
        let obj = {ArticleID:i,Des:somme[i].Des,TTQteCmde:somme[i].TTQteCmde,TTQteRecu:somme[i].TTQteRecu,open:0};
        sommeRet[j]=obj; j++; 
       } 
    }
    return sommeRet;
   }

   nbDeRecepteurs(ArticleID:number){
    var nb=0;
    for (var i = 0;  i<this.receptiondet.length; i++ ) {
      if(this.receptiondet[i].ArticleID == ArticleID){nb=nb+1;}
    }
    return nb;
  }

  open(ArticleID){
    this.receptiondetsomme.forEach(e=>{
        if(e.ArticleID!=ArticleID){e.open=0;}
        if(e.ArticleID==ArticleID){
          if(e.open==1)e.open=0;
          else e.open=1;
        }
    });
  }

  roundMath(value){
    return (Math.round(value * 10000)/10000);
    }

    ImprimerReception(){
      let body = {'reception':this.reception,'reception_det':this.receptiondetsomme};
      this.openDialog(body);
    }
  
    openDialog(res){
      const dialogRef = this.dialog.open(AppercuImpressionReceptionComponent, {
        width: '90%',
        data: {data:res}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('ipression reception done ');
      });
    }



}
