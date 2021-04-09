import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute } from '@angular/router';
import { Modif } from '../interfaces/modif';
import { AppercuImpressionModificationComponent } from '../appercu-impression-modification/appercu-impression-modification.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-cmd-reception-modif',
  templateUrl: './cmd-reception-modif.component.html',
  styleUrls: ['./cmd-reception-modif.component.scss']
})
export class CmdReceptionModifComponent implements OnInit {
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/achat/cmd/modifs/liste',title:"Liste modifications"}
  ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/cmd',title:'cmd'} ,
    {url:'gmao/achat/reception',title:'reception'} ,
    {url:'',title:'Affichage modification reception'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  //###############################
CmdRecModifID:number=0;
isData=false;
loaded=false;

expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    console.log(id);
    if (checked) {
      this.expandSet.add(id);
      
    } else {
      this.expandSet.delete(id);
    }
  }


  modif;
  modifs=[];
  modifssomme=[];
  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,private dialog: MatDialog
  ,private _notification: MessageService
  ,public dialogRef: MatDialogRef<CmdReceptionModifComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data) { }


  ngOnInit() {
    /*
    let CmdRecModifID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CmdRecModifID>0){ // nthabbit yatla3ch null zeda normalement 
      this.getModif(CmdRecModifID);
    }
    */

    let CmdRecModifID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CmdRecModifID>0){
      this.CmdRecModifID=CmdRecModifID;
      this.getModif(CmdRecModifID);
    }else{  
      CmdRecModifID=this.data.CmdRecModifID;
      if(CmdRecModifID>0){
        this.isData=true;
        this.CmdRecModifID=CmdRecModifID;
        this.getModif(CmdRecModifID);
      }
    }

  }

  getModif(CmdRecModifID:number){
    this.cmdService.getModif(CmdRecModifID).then(
      res=>{
        this.modif=res.modif;
        this.modifs=res.modif_det;
        this.modifssomme=this.somme();
        this.loaded=true;
      },
      err=>console.log('CmdReceptionModifComponent:getModif:',err)
    )
  }


  somme(){
    let somme:Modif[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.modifs.length; i++ ) {
     let article_id = this.modifs[i].ArticleID;
     if(somme[article_id]){
     somme[article_id].Des=this.modifs[i].des;
     somme[article_id].TTAn+=this.modifs[i].AnQteRecu;
     somme[article_id].TTNv+=this.modifs[i].NvQteRecu;
     }else{
       somme[article_id]={Des:this.modifs[i].des,TTAn:this.modifs[i].AnQteRecu,TTNv:this.modifs[i].NvQteRecu};
     }
    }
    var j=0;
    for (var i = 0;  i<somme.length; i++ ) {
     if(somme[i]){
        let obj = {ArticleID:i,Des:somme[i].Des,TTAn:somme[i].TTAn,TTNv:somme[i].TTNv,open:0};
        sommeRet[j]=obj; j++; 
       } 
    }
    return sommeRet;
   }


   nbDeRecepteurs(ArticleID:number){
    var nb=0;
    for (var i = 0;  i<this.modifs.length; i++ ) {
      if(this.modifs[i].ArticleID == ArticleID){nb=nb+1;}
    }
    return nb;
  }

  open(ArticleID){
    this.modifssomme.forEach(e=>{
        if(e.ArticleID!=ArticleID){e.open=0;}
        if(e.ArticleID==ArticleID){
          if(e.open==1)e.open=0;
          else e.open=1;
        }
    });
  }


  roundMath(value){ return (Math.round(value * 10000)/10000); }

  ImprimerModification(){
    let body = {'modification':this.modif,'modification_det':this.modifssomme};
    this.openDialog(body);
  }

  openDialog(res){
    const dialogRef = this.dialog.open(AppercuImpressionModificationComponent, {
      width: '90%',
      data: {data:res}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('ipression modification done ');
    });
  }


  // ------ Notification & Redirection  --------------

  //UrlToRedirection="/gmao/preventif/bonp/bonp/";
  redirection(url) {
    //this._router.navigate([url]);
  }
  
  notification(type: string, msg: string, duree: number) {
    // type : primary , success , danger 
    this._notification.create(
      type,
      msg,
      {
        Position: "top-right",
        Style: "simple",
        Duration: duree
      }
    );
  }
//###################################################



}
