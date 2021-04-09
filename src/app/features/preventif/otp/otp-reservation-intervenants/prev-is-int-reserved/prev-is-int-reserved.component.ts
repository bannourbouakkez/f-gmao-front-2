import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import { PrevResIntService } from '../prev-res-int.service';
import moment, { isMoment } from 'moment';

@Component({
  selector: 'app-prev-is-int-reserved',
  templateUrl: './prev-is-int-reserved.component.html',
  styleUrls: ['./prev-is-int-reserved.component.scss']
})
export class PrevIsIntReservedComponent implements OnInit {

  @Input() IntervenantID:number;
  @Input() date1:string;
  @Input() time1:string;
  @Input() date2:string;
  @Input() time2:string;
  @Input() ReservationIntervenantID:any;
  

  @Output() ResultObject: EventEmitter<any> = new EventEmitter<any>();
  l_ResultObject:any;
  loading=false;


  constructor(private prevResIntService:PrevResIntService) { }

  ngOnInit(){
    
    if(this.IntervenantID && this.date1 && this.time1 && this.date2 && this.time2){
    this.Action();
    }
    
  }

  ngOnChanges(){
    if(this.IntervenantID && this.date1 && this.time1 && this.date2 && this.time2){
    this.Action();
    }
  }


  Action(){
    
    this.loading=true;
    this.prevResIntService.IsIntReserved(this.IntervenantID,this.ReservationIntervenantID,this.date1,this.time1,this.date2,this.time2).then(
      res=>{
        //console.log('this.ReservationIntervenantID'+'='+this.ReservationIntervenantID);
        console.log(res);
        
        
        let IsIntReserved=res.IsIntReserved;
        let DateTimeList=res.DateTimeList;
        let obj:any={};
        obj.IsIntReserved=IsIntReserved;
        obj.DateTimeList=DateTimeList;
        this.l_ResultObject=obj;
        this.ResultObject.emit(this.l_ResultObject);

        this.loading=false;
        

    });
   }

    
   
  
   JustDateString(date:string){

    if(date==null) return date;
    if (isMoment(date)){
       return date.format('DD/MM/YYYY');
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


