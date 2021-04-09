import { Component, OnInit , Output, Input , EventEmitter} from '@angular/core';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { PrevReservationComponent } from '../prev-reservation/prev-reservation.component';
import { PrevResIntService } from '../prev-res-int.service';
//import { isMoment } from 'moment';
import moment, { isMoment } from 'moment';

//import { PrevResIntService } from '../prev-res-int.service';

@Component({
  selector: 'app-prev-reservation-default',
  templateUrl: './prev-reservation-default.component.html',
  styleUrls: ['./prev-reservation-default.component.scss']
})
export class PrevReservationDefaultComponent implements OnInit {
  
  @Input() Input_IntReservationID:number;
  @Input() Input_OtpID:number;
  @Input() Input_DateTimeOTp:string;
  @Input() Input_reservedintervenants:any[];
  @Input() Input_DontSend:boolean;
  @Input() InterventionID:boolean;

  @Input() InputEquipementID:number;
  @Input() InputEquipement:string;
  @Input() InputNiv:number;


  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  
  IntReservationID:number=0;
  OtpID:number=0;
  DateTimeOTp:string;
  DontSend:boolean=true;
  //@Output() action: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private dialog: MatDialog
  ,public resIntService:PrevResIntService
  ,public dialogRef: MatDialogRef<PrevReservationDefaultComponent>
    ) { }

  ngOnInit() {
    //this.resetForm();
    this.IntReservationID=this.Input_IntReservationID;
    this.OtpID=this.Input_OtpID;
    this.DateTimeOTp=this.Input_DateTimeOTp;
    this.DontSend=this.Input_DontSend;
    this.resIntService.aff_zok=this.Input_reservedintervenants;
    //console.log(this.resIntService.reservedintervenants);
   }

   ngOnChanges(){
    this.IntReservationID=this.Input_IntReservationID;
    this.OtpID=this.Input_OtpID;
    this.DateTimeOTp=this.Input_DateTimeOTp;
    //this.resIntService.aff_zok=this.Input_reservedintervenants;
   }


  
  OpenPrevReservation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "80%"; 

    let OtpID=this.OtpID;
    let IntReservationID=this.IntReservationID;
    let DateTimeOTp=this.DateTimeOTp;
    let DontSend=this.DontSend;
    let InterventionID=this.InterventionID;

    let InputEquipementID=this.InputEquipementID;
    let InputEquipement=this.InputEquipement;
    let InputNiv=this.InputNiv;

    dialogConfig.data = {OtpID,IntReservationID,DateTimeOTp,DontSend,InterventionID,InputEquipementID,InputEquipement,InputNiv};
    this.dialog.open(PrevReservationComponent, dialogConfig).afterClosed().subscribe(res => {
      
     
      if(res){
      console.log(res);
      if(res.reservedintervenants.length>0){
        this.resIntService.aff_zok=[];
        
        for(let i=0;i<res.reservedintervenants.length;i++){
          console.log(res.reservedintervenants[i]);
          this.resIntService.aff_zok.push(res.reservedintervenants[i]);
          console.log(this.resIntService.aff_zok);
        }
      }
      this.Action(res.IntReservationID);
      }

    //if(res=='again' && ReservationIntervenantIndex==null){ this.AddOrEditOtpReservedIntervenant(ReservationIntervenantIndex, IntReservationID); }
    
     //console.log('ret:'+res);

    });
    
  }

  /*
  resetForm() {
    this.resIntService.formData = {
      DeletedBonIntervenantIDs: '',
    };
    this.resIntService.reservedintervenants  = [];
  }
  */

 Action(IntReservationID){this.action.emit(IntReservationID);}


 afficheraff_zok(){
   console.log(this.resIntService.aff_zok);
 }

 
 viderIntervenantsReserved(){
  if(this.IntReservationID){

  this.resIntService.viderIntervenantsReserved(this.IntReservationID).then(
    res => {
      if(res.success){

        this.resIntService.aff_zok=[];
        this.IntReservationID=0;
      }
    },
    err=>{}
  );
  
  }else{
    this.resIntService.aff_zok=[];
    this.IntReservationID=0;
  }

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


CalculerNbMinBetweenTwoDate(date1: Date, time1: Date, date2: Date, time2: Date) {


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
