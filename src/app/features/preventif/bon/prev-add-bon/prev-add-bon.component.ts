import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrevOtpService } from '../../services/prev-otp.service';
import { PrevBonpService } from '../../services/prev-bonp.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import moment, { isMoment } from 'moment';
import { PrevBonIntervenantComponent } from '../prev-bon-intervenant/prev-bon-intervenant.component';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-prev-add-bon',
  templateUrl: './prev-add-bon.component.html',
  styleUrls: ['./prev-add-bon.component.scss']
})
export class PrevAddBonComponent implements OnInit {

  
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/preventif/bonp/bonps',title:'Liste bons de travail'}
    ];
   breadcrumb=[];
   breadcrumbFunc(){
   this.breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/bonp',title:'Bon'},
    {url:'',title:this.AjouterOuModifier(this.BonpID)+' Bon De Travail'}
  ];
  }
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  AjouterOuModifier(bool){ if(bool){return 'Modifier';}else{ return 'Ajouter';} }
  LoadingReactBtn1=false;
  //###############################

  loading=false;
  date=new Date();
  OtpID:number=0;

  BonpID:number=0;
  otp:any;
  bonp:any;  
  intervenants=<any>[];
  articles=<any>[];
  articles_TS=<any>[];
  niveaux=<any>[];

  constructor(private _currentRoute: ActivatedRoute,private otpService:PrevOtpService,private bonService:PrevBonpService
    ,private dialog: MatDialog , private _router:Router,
    private _notification: MessageService) { }

  ngOnInit() {

    this.resetForm();
    let OtpID = +this._currentRoute.snapshot.paramMap.get('OtpID');
    let BonpID = +this._currentRoute.snapshot.paramMap.get('BonpID');
    this.getBonp(OtpID,BonpID);

  }


  getBonp(OtpID:number,BonpID:number){
    this.loading=true;
    this.bonService.getBonp(OtpID,BonpID).then(
      res=>{ 
         console.log(res);
         if(res.isBonpExist){  this._router.navigate(['/index']); }
         this.loading=false;
         this.bonService.bonpintervenants = res.bonpintervenants;

         if(res.bonp){
         this.bonService.formData.Rapport=res.bonp.rapport;
         this.bonService.formData.date_cloture=res.bonp.date_cloture;
         }
         this.otp=res.otp;
         this.bonp=res.bonp;
         this.articles=res.articles;
         this.niveaux=res.niveaux;
         this.OtpID=res.otp.OtpID;
         this.BonpID=BonpID;
         this.breadcrumbFunc();

         for (let i = 0; i < this.articles.length; i++) {  this.articles[i]['formControl'] = new FormControl(this.articles[i].qteu);}
        
        },
      err=>console.log(err)
    );
  }


  
  resetForm() {
    this.bonService.formData = {
      DeletedBonpIntervenantIDs: '',
      Rapport:'',
      date_cloture:''
    };
    this.bonService.bonpintervenants = []; 
  }

  
  AddOrEditBonpIntervenant(BonIntervenantIndex, BonID) {
 
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "90%"; 
    let DateTimeOT=this.otp.date_execution;
    console.log(DateTimeOT);
    //console.log(this.otp);
    let EquipementIDForTaches=this.otp.equipement_id; 
    let EquipementForTaches=this.otp.equipement; // noooooooooooooooooooooooooooooode
    let NiveauForTaches=this.otp.Niv; // noooooooooooooooooooooooooooooode

    dialogConfig.data = { BonIntervenantIndex , BonID , DateTimeOT , EquipementIDForTaches , EquipementForTaches , NiveauForTaches };  // noooooooooooooooooooooooooooooode
    this.dialog.open(PrevBonIntervenantComponent, dialogConfig).afterClosed().subscribe(res => {
     //if(res=='again' && BonIntervenantIndex==null){ this.AddOrEditBonpIntervenant(BonIntervenantIndex, BonID); }
    });
    
  }

  
  Submit(){

    if(this.bonService.bonpintervenants.length>0){
      if(this.bonService.isAllCompletedIncludeTache()){
          if(this.isArticlesLogique()){
            if(!this.LoadingReactBtn1){
              this.LoadingReactBtn1=true;
       
          /*
          console.log(this.corrBonService.formData);
          console.log(this.corrBonService.bonintervenants); 
          console.log(this.articles); 
          */

         this.newArray();

          if(this.BonpID==0){
            this.bonService.addBonp(this.OtpID,this.bonService.formData,this.bonService.bonpintervenants,this.articles_TS).then(
              res=>{
                
                this.LoadingReactBtn1=false;
                if(res.bonp){
                console.log(res);

                }

                if(res.bonp){
                  if(res.bonp.BonpID){
                  this.notification('success', "Le bon est ajoutée avec succès.", 3000);
                  this.redirection(this.UrlToRedirection+res.bonp.BonpID);
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
             this.bonService.editBonp(this.BonpID,this.bonService.formData,this.bonService.bonpintervenants,this.articles_TS ).then(
               res=>{
                 this.LoadingReactBtn1=false;
                 console.log(res);
                 if(res.success_edit){
                  this.notification('success', "Le bon est Modifiée avec succès.", 3000);
                  this.redirection(this.UrlToRedirection+this.BonpID);
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
            //console.log('articles cava pas '); 
            this.notification('danger', "articles cava pas ", 3000);
          }
      }else{ 
        //console.log('méch completed');
        this.notification('danger', "méch completed intervenants", 3000);
      }
    }else{
      //console.log('lazim au moins 5addem');
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


 onDeleteBonpIntervenant(BonpIntervenantID: number, i: number) {
  if (BonpIntervenantID != null){ 
    this.bonService.formData.DeletedBonpIntervenantIDs += BonpIntervenantID + ",";
  }
  this.bonService.bonpintervenants.splice(i, 1);
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
  UrlToRedirection="/gmao/preventif/bonp/bonp/";
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
