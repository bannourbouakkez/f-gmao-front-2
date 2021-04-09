import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtService } from '../../services/ot.service';
import { CorrBonService } from '../../services/corr-bon.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CorrBonIntervenantComponent } from '../corr-bon-intervenant/corr-bon-intervenant.component';
import moment, { isMoment } from 'moment';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-corr-bon-add',
  templateUrl: './corr-bon-add.component.html',
  styleUrls: ['./corr-bon-add.component.scss']
})
export class CorrBonAddComponent implements OnInit {
  
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/correctif/bon/bons',title:'Liste bons de travail'}
    ];
   breadcrumb=[];
   breadcrumbFunc(){
   this.breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/correctif',title:'correctif'} ,
    {url:'gmao/correctif/bon',title:'Bon'},
    {url:'',title:this.AjouterOuModifier(this.BonID)+' Bon De Travail'}
  ];
  }
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  AjouterOuModifier(bool){ if(bool){return 'Modifier';}else{ return 'Ajouter';} }
  LoadingReactBtn1=false;
  //###############################


  //datex=new moment('');
  loading=false;
  date=new Date();
  OtID:number=0;
  BonID:number=0;
  ot:any;
  bon:any;
  intervenants=<any>[];
  articles=<any>[];
  articles_TS=<any>[];
  niveaux=<any>[];
  //EquipementID=0;
  constructor(private _currentRoute: ActivatedRoute,private otService:OtService,private corrBonService:CorrBonService
             ,private dialog: MatDialog , private _router:Router
             , private _notification: MessageService
            ) { }
  
  ngOnInit() {
    this.resetForm();
    let OtID = +this._currentRoute.snapshot.paramMap.get('OtID');
    let BonID = +this._currentRoute.snapshot.paramMap.get('BonID');
    //console.log(BonID);
    this.getBon(OtID,BonID);
    // if BonID
  }
  
  getBon(OtID:number,BonID:number){
    this.loading=true;
    this.otService.getBon(OtID,BonID).then(
      res=>{ 
         console.log(res);
         if(res.isBonExist){  this._router.navigate(['/index']); }

         this.loading=false;
         this.corrBonService.bonintervenants = res.bonintervenants;
         this.corrBonService.formData.Rapport=res.bon.rapport;
         this.ot=res.ot;
         this.bon=res.bon;
         this.articles=res.articles;
         //console.log(this.articles.length);
         this.niveaux=res.niveaux;
         //this.EquipementID=res.EquipementID;
         this.OtID=res.ot.OtID;
         this.BonID=BonID;

         this.breadcrumbFunc();

         for (let i = 0; i < this.articles.length; i++) {  this.articles[i]['formControl'] = new FormControl(this.articles[i].qteu);}
        
         // this.toMoment();
        },
      err=>console.log(err)
    );
  }

  toMoment(){
    for(let i=0;i<this.corrBonService.bonintervenants.length;i++){
      if(this.corrBonService.bonintervenants[i].date1 != null){
      this.corrBonService.bonintervenants[i].date1=moment(new Date(this.corrBonService.bonintervenants[i].date1));
      }
      if(this.corrBonService.bonintervenants[i].time1 != null){
        this.corrBonService.bonintervenants[i].time1=moment(new Date(this.corrBonService.bonintervenants[i].time1));
      }
      if(this.corrBonService.bonintervenants[i].date2 != null){
        this.corrBonService.bonintervenants[i].date2=moment(new Date(this.corrBonService.bonintervenants[i].date2));
      }
      if(this.corrBonService.bonintervenants[i].time2 != null){
        this.corrBonService.bonintervenants[i].time2=moment(new Date(this.corrBonService.bonintervenants[i].time2));
      }
    }
  }

  
  AddOrEditBonIntervenant(BonIntervenantIndex, BonID) {
 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "90%"; 
    let DateTimeOT=this.ot.datetime;
    let EquipementIDForTaches=this.ot.equipement_id;

    let EquipementForTaches=this.ot.equipement; // noooooooooooooooooooooooooooooode
    let NiveauForTaches=this.ot.Niv; // noooooooooooooooooooooooooooooode

    console.log(EquipementIDForTaches+' ; '+EquipementForTaches+' ; '+NiveauForTaches);
    dialogConfig.data = { BonIntervenantIndex , BonID , DateTimeOT , EquipementIDForTaches , EquipementForTaches , NiveauForTaches}; 
    this.dialog.open(CorrBonIntervenantComponent, dialogConfig).afterClosed().subscribe(res => {
     //if(res=='again' && BonIntervenantIndex==null){ this.AddOrEditBonIntervenant(BonIntervenantIndex, BonID); }
    });
    
  }
  

  resetForm() {
    this.corrBonService.formData = {
      DeletedBonIntervenantIDs: '',
      Rapport:''
    };
    this.corrBonService.bonintervenants  = [];
  }


  Submit(){

    if(this.corrBonService.bonintervenants.length>0){
      if(this.corrBonService.isAllCompleted()){
          if(this.isArticlesLogique()){
            if(!this.LoadingReactBtn1){
              this.LoadingReactBtn1=true;
          /*
          console.log(this.corrBonService.formData);
          console.log(this.corrBonService.bonintervenants); 
          console.log(this.articles); 
          */

         this.newArray();
         //console.log(this.articles_TS);

          if(this.BonID==0){
            this.corrBonService.addBon(this.OtID,this.corrBonService.formData,this.corrBonService.bonintervenants,this.articles_TS).then(
              res=>{
                //console.log(res);
                this.LoadingReactBtn1=false;

                if(res.bon){
                  if(res.bon.BonID){
                  this.notification('success', "Le bon est ajoutée avec succès.", 3000);
                  this.redirection(this.UrlToRedirection+res.bon.BonID);
                  }else{
                    this.notification('danger', "Error.", 3000);
                  }
                  }else{
                    this.notification('danger', "Error.", 3000);
                  }
              },
              err=>console.log()
            );
           }else{
             this.corrBonService.editBon(this.BonID,this.corrBonService.formData,this.corrBonService.bonintervenants,this.articles_TS ).then(
               res=>{
                // console.log(res);
                this.LoadingReactBtn1=false;
                console.log(res);
                if(res.success_edit){
                 this.notification('success', "Le bon est Modifiée avec succès.", 3000);
                 this.redirection(this.UrlToRedirection+this.BonID);
                 }else{
                   this.notification('danger', "Error.", 3000);
                 }

                },
               err=>console.log()
             );
           }

           this.articles_TS=[];
           

          }
          }else{   
           this.notification('danger', "articles cava pas ", 3000);
        }
      }else{ 
        this.notification('danger', "méch completed intervenants", 3000);
      }
    }else{
      this.notification('danger', "lazim au moins 5addem", 3000);
    }





 }


 isArticlesLogique(){
  for(let i=0;i<this.articles.length;i++){
    if(!this.isNumber(this.articles[i].formControl.value)){return false;}
    if(this.articles[i].formControl.value<0){return false;}
    if(this.articles[i].formControl.value>this.articles[i].qtea){return false;}
  }
  return true;
 }


 onDeleteBonIntervenant(BonIntervenantID: number, i: number) {
  if (BonIntervenantID != null){ 
    this.corrBonService.formData.DeletedBonIntervenantIDs += BonIntervenantID + ",";
  }
  this.corrBonService.bonintervenants.splice(i, 1);
}


ReglageDate(date:Date){
  let userTimezoneOffset = date.getTimezoneOffset() * 60000;
  let date2=new Date(this.date.getTime() - userTimezoneOffset);
  return date2;
}


JustDateString(date:string){

  if(date==null) return date;
  if (isMoment(date)){
     return date.format('YYYY-MM-DD');
  }
  return date.slice(0,10);
}

JustTimeString(date){
  if(date==null) return date;
  if (isMoment(date)){
     return date.format('HH:mm');
  }
  return date.slice(11,16);
}

roundMath(value){
  return (Math.round(value * 1000000)/1000000);
}

isNumber(value: string | number): boolean
{
   return ((value != null) &&
           (value !== '') &&
           !isNaN(Number(value.toString())));
}

 newArray(){
  for (let i = 0; i < this.articles.length; i++) {
   if(this.isNumber(this.articles[i].formControl.value)){
    let obj = {
      article_id:this.articles[i].article_id,
      qtear:this.articles[i].qtea-this.articles[i].formControl.value
       };
    this.articles_TS.push(obj);
   }
  }
}





CalculerNbMinBetweenTwoDate4(date1: Date, time1: Date, date2: Date, time2: Date) {

  
  date1 = new Date(moment(date1).format("YYYY-MM-DDTHH:mm:00"));
  time1 = new Date(moment(time1).format("YYYY-MM-DDTHH:mm:00"));
  date2 = new Date(moment(date2).format("YYYY-MM-DDTHH:mm:00"));
  time2 = new Date(moment(time2).format("YYYY-MM-DDTHH:mm:00"));


  let datetimemin: Date = this.combineDateTime(date1, time1);
  let datetimemax: Date = this.combineDateTime(date2, time2);

  return (((datetimemax.getTime() - datetimemin.getTime()) / 1000) / 60);

}

combineDateTime(date: Date, time: Date) {

  let yyyy = date.getFullYear(); // .getUTCFullYear();
  let mm = date.getMonth() + 1; // .getUTCMonth()+1;
  let dd = date.getDate(); // .getUTCDate();
  //console.log('y:'+yyyy+' , m:'+mm+' ,d:'+dd);
  let hh = this.addZero(time.getHours()); // .getUTCHours());
  var mi = this.addZero(time.getMinutes()); // .getUTCMinutes());
  let stringdate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi;
  // let datetime=new Date(stringdate);
  let datetime = new Date(yyyy, mm, dd, hh, mi, 0, 0);
  return datetime;
}
addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}


CalculerNbMinBetweenTwoDate2(date1: Date, date2: Date) {


date1 = new Date(moment(date1).format("YYYY-MM-DDTHH:mm:00"));
date2 = new Date(moment(date2).format("YYYY-MM-DDTHH:mm:00"));


return (((date2.getTime() - date1.getTime()) / 1000) / 60);

}


affichageProHM(nbMin:number){
let nb=nbMin;
let h=Math.floor(nb/60);
nb=nb-(h*60);

let m=nb;
let affh="";
let affm="";

if(h>0){ affh=h+" h";}
if(m>0){ affm=" "+m+" m";}

return affh+affm;
}


  // ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/correctif/bon/bon/";
  redirection(url) {
    this._router.navigate([url]);
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
