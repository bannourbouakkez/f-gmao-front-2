import { Component, OnInit } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OuiOuNonComponent } from 'src/app/shared/others/oui-ou-non/oui-ou-non.component';
import { Article } from '../interfaces/article';
import { AppercuImpressionCmdComponent } from '../appercu-impression-cmd/appercu-impression-cmd.component';

@Component({
  selector: 'app-cmd',
  templateUrl: './cmd.component.html',
  styleUrls: ['./cmd.component.scss']
})
export class CmdComponent implements OnInit {
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/achat/cmd/liste',title:"Liste commandes"}
  ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/cmd',title:"Commande"},
    {url:'',title:"Commande"}
  ];
  
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  cmdLoaded=false;
  receptionsLoaded=false;
  isData=false;
  btnClicked=false;
  //################################
  CommandeID:number=0;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    console.log(id);
    if (checked) {
      this.expandSet.add(id);
      
    } else {
      this.expandSet.delete(id);
    }
  }



  cmd;
  cmddet=[];
  cmddetsomme=[];
  cmdtatut;
  receptions=[];
  arr_droitRestauration=[];
  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,private dialog: MatDialog,
              private _router: Router ) { }

  ngOnInit() {
    let CommandeID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CommandeID>0){ // nthabbit yatla3ch null zeda normalement 
      this.CommandeID=CommandeID;
      this.getCmd(CommandeID);
      this.getListeReception(CommandeID);
      this.DroitRestaurationCmd(CommandeID);
      this.btnClicked=false;
      this.cmdLoaded=false;
    }
  }

  getCmd(CommandeID:number){
    this.cmdService.getCmd(CommandeID).then(
      res=>{
        console.log(res);
        this.cmd=res.cmd[0];
        this.cmdtatut=this.cmd.exist; 
        this.cmddet=res.cmddet;
        this.cmddetsomme=this.somme();
        this.cmdLoaded=true;
      },
      err=>console.log('CmdComponent:getCmd:',err)
    );
  }

  getListeReception(CommandeID:number){
    this.cmdService.getListeReception(CommandeID).then(
      res=>{
        console.log(res);
        this.receptions=res;
        this.receptionsLoaded=true;

      },
      err=>console.log('CmdComponent:getListeReception:',err)
    );
  }

  somme(){
   let somme:Article[]=[];
   let sommeRet=[];
   for (var i = 0;  i<this.cmddet.length; i++ ) {
    let article_id = this.cmddet[i].article_id;
    if(somme[article_id]){
    somme[article_id].Des=this.cmddet[i].des;
    somme[article_id].TTQteCmde+=this.cmddet[i].QteCmde;
    somme[article_id].TTQteRecu+=this.cmddet[i].TTQteRecu;
    }else{
      somme[article_id]={Des:this.cmddet[i].des,TTQteCmde:this.cmddet[i].QteCmde,TTQteRecu:this.cmddet[i].TTQteRecu};
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

  open(ArticleID){
    this.cmddetsomme.forEach(e=>{
        if(e.ArticleID!=ArticleID){e.open=0;}
        if(e.ArticleID==ArticleID){
          if(e.open==1)e.open=0;
          else e.open=1;
        }
    });
  }

  nbDeDemandeurs(ArticleID:number){
    var nb=0;
    for (var i = 0;  i<this.cmddet.length; i++ ) {
      if(this.cmddet[i].article_id == ArticleID){nb=nb+1;}
    }
    return nb;
  }

  supprimerCmd(ComandeID:number){
    /*
    if(this.receptions.length==0){

    let type='danger'; let msg='Voulez vraiment supprimer la commande ? ';
    let btnoui='Confirmer'; let btnnon='Annuler';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { type, msg , btnoui , btnnon };
    this.dialog.open(OuiOuNonComponent, dialogConfig).afterClosed().subscribe(res => { 
    if(res==1){
      this.cmdService.supprimerCmd(ComandeID).then(
        res=>{ 
          console.log(res);
          //this._router.navigate(['/achat/cmd/liste']);
        },
        err=>console.log('CmdComponent:supprimerCmd:',err)
      );
    }
    });

    }else{ }
    */

   if(!this.btnClicked){
    this.btnClicked=true;
    console.log('supprimerCmd ...');
    if(this.receptions.length==0){
      this.cmdService.supprimerCmd(ComandeID).then(
        res=>{ 
          //console.log(res);
          this.cmdLoaded=false;
          this.ngOnInit();
          //this._router.navigate(['/achat/cmd/liste']);
        },
        err=>console.log('CmdComponent:supprimerCmd:',err)
      );
    }
  }


  }

  restaurerCmd(ComandeID:number){
    if(!this.btnClicked){
      this.btnClicked=true;
      console.log('restaurerCmd ...');
    if(this.arr_droitRestauration.length==0){
    this.cmdService.restaurerCmd(ComandeID).then(
      res=>{ 
        //this._router.navigate(['/achat/cmd/liste']);
        this.cmdLoaded=false;
        this.ngOnInit();
      },
      err=>console.log('CmdComponent:restaurerCmd:',err)
    );
  }else{}
}
  }

  fermerCmd(ComandeID:number){
    if(!this.btnClicked){
    this.btnClicked=true;
    console.log('fermerCmd ...');
    this.cmdService.fermerCmd(ComandeID).then(
      resferme=>{
        //console.log('ferme : '+JSON.stringify(resferme));
        this.cmdLoaded=false;
        this.ngOnInit();
      },
      errferme=>console.log(errferme)
    ); 
   }
  }

  ouvrirCmd(ComandeID:number){
    if(!this.btnClicked){
      this.btnClicked=true; console.log('ouvrirCmd ...');
    this.cmdService.ouvrirCmd(ComandeID).then(
      resferme=>{
        //console.log('ouvrir : '+resferme);
        this.cmdLoaded=false;
        this.ngOnInit();
    },
      errferme=>console.log(errferme)
    ); 
    }
  }

  DroitRestaurationCmd(ComandeID:number){
    this.cmdService.DroitRestaurationCmd(ComandeID).then(
      res=>{ 
        this.arr_droitRestauration=res;
        console.log(this.arr_droitRestauration);
       },
      err=>console.log('CmdComponent:DroitRestaurationCmd:',err)
    );
  }



  roundMath(value){ return (Math.round(value * 10000)/10000); }



  Imprimer(){
    let CmdIds=[];
    let CommandeID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CommandeID>0){  CmdIds.push(CommandeID) ; }
    this.cmdService.Imprimer(CmdIds).then(
      res=>{ this.openDialog(res); },
      err=>console.log('CmdComponent:Imprimer:',err)
    );
  }



  openDialog(res){
    const dialogRef = this.dialog.open(AppercuImpressionCmdComponent, {
      width: '90%',
      data: {data:res}
    });
    dialogRef.afterClosed().subscribe(result => { });
  }


}

