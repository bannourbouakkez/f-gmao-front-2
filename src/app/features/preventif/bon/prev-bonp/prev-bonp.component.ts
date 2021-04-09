import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrevBonpService } from '../../services/prev-bonp.service';
import moment, { isMoment } from 'moment';

@Component({
  selector: 'app-prev-bonp',
  templateUrl: './prev-bonp.component.html',
  styleUrls: ['./prev-bonp.component.scss']
})
export class PrevBonpComponent implements OnInit {

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

  BonpID:number=0;
  bonp:any;
  otp:any;
  niveaux=<any>[];
  intervenants=<any>[];
  articles=<any>[];
  bsos=<any>[];

  constructor(private prevBonpService:PrevBonpService,private _currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let BonpID = +this._currentRoute.snapshot.paramMap.get('id');
    if(BonpID>0){ this.getBonpForAff(BonpID); }
  }
  
  getBonpForAff(BonpID:number){
    this.prevBonpService.getBonpForAff(BonpID).then(
      res=>{
        console.log(res);
        this.bonp=res.bonp;
        this.otp=res.otp;
        this.niveaux=res.niveaux;
        this.intervenants=res.intervenants;
        this.articles=res.articles;
        this.bsos=res.bsos;
        this.BonpID=res.bonp.BonpID;
        //this.loaded=true;
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



}
