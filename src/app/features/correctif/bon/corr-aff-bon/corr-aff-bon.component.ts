import { Component, OnInit } from '@angular/core';
import { CorrBonService } from '../../services/corr-bon.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import moment, { isMoment } from 'moment';

@Component({
  selector: 'app-corr-aff-bon',
  templateUrl: './corr-aff-bon.component.html',
  styleUrls: ['./corr-aff-bon.component.scss']
})
export class CorrAffBonComponent implements OnInit {
//---------- breadcrumb ---------
autres=[ 
  {url:'gmao/preventif/bonp/bonps',title:'Liste bons de travail'}
  //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
  ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/preventif',title:'preventif'} ,
    {url:'gmao/preventif/bonp',title:'Bon'},
    {url:'#',title:'Affichage Bon'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  //###############################

  /*
  BonID:number=0;
  bon:any;
  taches=<any>[];
  retours=<any>[];
  me:any;
  */

  BonID:number=0;
  bon:any;
  ot:any;
  niveaux=<any>[];
  intervenants=<any>[];
  articles=<any>[];
  bsos=<any>[];


  constructor(private corrBonService:CorrBonService,private _currentRoute: ActivatedRoute,private _authService: AuthService) { }
  
  ngOnInit() {
    let BonID = +this._currentRoute.snapshot.paramMap.get('id');
    if(BonID>0){ this.getBon(BonID); }
  }

  getBon(BonID:number){  
    this.corrBonService.getBonForAff2(BonID).then(
      res=>{
        /*
        console.log(res);
        this.bon=res.bon;
        this.taches=res.taches;
        this.retours=res.retours;
        this.me = res.me;
        this.BonID=res.bon.BonID;
        */
       this.bon=res.bon;
       this.ot=res.ot;
       this.niveaux=res.niveaux;
       this.intervenants=res.intervenants;
       this.articles=res.articles;
       this.bsos=res.bsos;
       this.BonID=res.bon.BonID;

      },
      err=>console.log(err)
    );
   }




   JustDateString(date:string){

    if(date==null) return date;
    if (isMoment(date)){
       return date.format('DD-MM-YYYY');
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




/*
   isPoste(ExpectedPoste: string) {
    return this._authService.isPoste(ExpectedPoste);
  }
  
  isPosts(ExpectedPosts) {
    let bool = false;
    for (let i = 0; i < ExpectedPosts.length; i++) {
      if (this.isPoste(ExpectedPosts[i])) { bool = true; }
    }
    return bool;
  }

  isCCR(di: any) {
    if ((this.me.id == di.user_id)){ // || (this.me.id == di.demandeur_user_id) || (this.me.id == di.recepteur_user_id)) {
      return true;
    } else {
      return false;
    }
  }
  */





}
