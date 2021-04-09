import { Component, OnInit } from '@angular/core';
import { DaService } from '../services/da.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-da',
  templateUrl: './da.component.html',
  styleUrls: ['./da.component.scss']
})
export class DaComponent implements OnInit {

  da:any;
  daarticles=[];
  daarticles_cmde=[];
  msgEnCours='En Cours';
  msgRefuse='refusé';

  DaID:number=0;
  pageLoaded=false;

  constructor(private _daService:DaService,private _currentRoute: ActivatedRoute) { }
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/achat/da/gererda/das',title:"Liste demandes d'achat"}
  ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/da',title:"Demande d'achat"},
    {url:'',title:"Demande d'achat"}
  ];
  
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  isData=false;


  ngOnInit() {
    let DaID = +this._currentRoute.snapshot.paramMap.get('id');

    if(DaID>0){
    this.DaID=DaID;
    this.nvGetDa(DaID);
    }
  }

  nvGetDa(DaID:number){
   this._daService.nvGetDa(DaID).then(
     res=>{
      this.da=res.da;
      this.daarticles=res.daarticle;
      this.daarticles_cmde=res.daarticle_cmde;
      console.log(res);
      this.pageLoaded=true;
    },
     err=>console.log(err)
   );
  }
  
    //getLigneDaarticles_cmdeByDaArticleID(daarticle_id:number){
    da_article(daarticle_id:number){
        for (var j = 0;  j<this.daarticles_cmde.length; j++ ) {
          let id_daarticles_cmde=this.daarticles_cmde[j].daarticle_id;
          if(daarticle_id == id_daarticles_cmde){
            return this.daarticles_cmde[j];
          }
        }
   return false;
  }
  
  
  ReturnLigneNumberOrfalse(NumberOrFalse){

   if(NumberOrFalse===undefined || NumberOrFalse===false){
    return this.msgEnCours;
   }

   if(NumberOrFalse===false){
    return 0;
   }

   if(this.isNumber(NumberOrFalse)){
    if(NumberOrFalse==0){
      return this.msgRefuse;
    }else{
      return NumberOrFalse;
    }
   }
   return "?";
   }

   urai(QteCmde:any){

     //let res:string="";
     if(QteCmde===undefined){ return "undefined"; }
     else if(this.isNumber(QteCmde)){ 
       if(QteCmde == 0){
        return "refused";
       }else{
        return "accepted";
       }
      }else{
        return "i";
      }
     
   }
  

  isNumber(value: string | number): boolean
    {
       return ((value != null) &&
               (value !== '') &&
               !isNaN(Number(value.toString())));
     }
  


  


  /*

  somme(){
    let somme:Article[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.receptiondet.length; i++ ) {
     let article_id = this.receptiondet[i].ArticleID;
     if(somme[article_id]){
     somme[article_id].Des=this.receptiondet[i].des;
     somme[article_id].TTQteCmde+=this.receptiondet[i].QteCmde; console.log(this.receptiondet[i].QteCmde);
     somme[article_id].TTQteRecu+=this.receptiondet[i].QteRecu;
     }else{
      console.log(this.receptiondet[i].QteCmde);
       somme[article_id]={Des:this.receptiondet[i].des,TTQteCmde:this.receptiondet[i].QteCmde,TTQteRecu:this.receptiondet[i].QteRecu};
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

  */

 conversionStatut(statut:string){
  
  if(statut=='encours'){return 'En Cours';}
  if(statut=='reenvoye'){return 'En Cours';}
  if(statut=='confirme'){return 'Confirmé';}
  if(statut=='confirmeParAdmin'){return 'Confirmé';}
  if(statut=='rejete'){return 'Rejeté';}
  if(statut=='rejeteParAdmin'){return 'Rejeté';}
  if(statut=='reporte'){return 'Reporté';}
  if(statut=='reporteParAdmin'){return 'Reporté';}
  if(statut=='reencours'){return 'En Cours';}
  if(statut=='reenattenteParAdmin'){return 'En cours';}
  if(statut=='enattente'){return 'En Cours';}
  
  if(statut=='confirmeCommande'){return 'Confirmé';}
  if(statut=='confirmeFerme'){return 'Confirmé';}
  if(statut=='confirmeParAdmin'){return 'Confirmé';}
  if(statut=='confirmeParAdminCommande'){return 'Confirmé';}
  
}


}
