import { Component, OnInit, Inject } from '@angular/core';
import { PrevResIntService } from '../prev-res-int.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { isMoment } from 'moment';
import { PrevReservationIntervenantComponent } from '../prev-reservation-intervenant/prev-reservation-intervenant.component';

@Component({
  selector: 'app-prev-reservation',
  templateUrl: './prev-reservation.component.html',
  styleUrls: ['./prev-reservation.component.scss']
})
export class PrevReservationComponent implements OnInit { 
  
  OtpID:number=0;
  IntReservationID:number=0;
  DateTimeOTp:string;
  DontSend:boolean;
  
  arr=<any>[];
  
  date=new Date();
  
  constructor(public resIntService:PrevResIntService, @Inject(MAT_DIALOG_DATA) private data,
  public dialogRef: MatDialogRef<PrevReservationComponent>,private dialog: MatDialog) { }

  ngOnInit() {
    this.resetForm();

    this.IntReservationID=this.data.IntReservationID;
    this.OtpID=this.data.OtpID;
    this.DateTimeOTp=this.data.DateTimeOTp;
    this.DontSend=this.data.DontSend;

   
    this.resIntService.reservedintervenants=[];
    if(this.resIntService.aff_zok.length>0){
      for(let i=0;i<this.resIntService.aff_zok.length;i++){
        this.resIntService.reservedintervenants.push(this.resIntService.aff_zok[i]);
      }
    }
    
    console.log('this.IntReservationID='+this.IntReservationID);

  }
  
  AddOrEditOtpReservedIntervenant(ReservationIntervenantIndex,IntReservationID,DateTimeOTp) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "90%"; 
    let OtpIDForTaches=this.OtpID;
    let InterventionIDForTaches=this.data.InterventionID;

    let InputEquipementID=this.data.InputEquipementID;
    let InputEquipement=this.data.InputEquipement;
    let InputNiv=this.data.InputNiv;

    dialogConfig.data = { ReservationIntervenantIndex , IntReservationID , DateTimeOTp , OtpIDForTaches , InterventionIDForTaches , InputEquipementID , InputEquipement , InputNiv}; 
    this.dialog.open(PrevReservationIntervenantComponent, dialogConfig).afterClosed().subscribe(res => {
     //if(res=='again' && ReservationIntervenantIndex==null){ this.AddOrEditOtpReservedIntervenant(ReservationIntervenantIndex,IntReservationID,DateTimeOTp); }
    });
  }



  resetForm() {
    this.resIntService.formData = {
      DeletedBonIntervenantIDs: '',
    };
    this.resIntService.reservedintervenants  = [];
  }






  Submit(){

    //console.log('OtpID:'+this.OtpID+',IntReservationID:'+this.IntReservationID+',DateTimeOTp:'+this.DateTimeOTp);
    //console.log(this.resIntService.reservedintervenants);
    
    
    if(this.resIntService.reservedintervenants.length>0){
      if(this.resIntService.isAllCompleted()){
          
          
          
          if(this.IntReservationID==0 || this.IntReservationID==null || this.IntReservationID==undefined){

            if(!this.DontSend){
            
            
            this.resIntService.addIntReservation(this.OtpID,this.resIntService.reservedintervenants).then(
            res=>{
            console.log(res);
            if(res.success){
            var resultat:any={};
            resultat.reservedintervenants=res.reservedintervenants  // jeyya mel BD 
            resultat.IntReservationID=res.IntReservationID; // jeyya mel BD
            console.log('addIntReservation');
            this.dialogRef.close(resultat);
            }

            },
            err=>console.log()
            );
            
            }else{
              // dont send
            var resultat:any={};
            resultat.reservedintervenants=this.resIntService.reservedintervenants; 
            resultat.IntReservationID=null;
            this.dialogRef.close(resultat);

            
            //console.log('return this.resIntService.reservedintervenants');
            //this.dialogRef.close(this.resIntService.reservedintervenants);
            }


           }else{

             
             this.resIntService.editIntReservation(this.IntReservationID,this.resIntService.formData,this.resIntService.reservedintervenants).then(
               res=>{
                console.log(res);
                if(res.success){
                  var resultat:any={};
                  resultat.reservedintervenants=res.reservedintervenants;  // jeyya mel BD 
                  //console.log('jeyya mel BD');
                  //console.log(res.reservedintervenants);
                  resultat.IntReservationID=res.IntReservationID; 
                  console.log('editIntReservation');
                  this.dialogRef.close(resultat);
                  }
                },
               err=>console.log()
             );
             
           }
           


         
      }else{ console.log('méch completed');}
    }else{console.log('lazim au moins 5addem');}
    
 }

ReglageDate(date:Date){
  date=new Date(date);
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



onDeleteBonIntervenant(BonIntervenantID: number, i: number) {
  if (BonIntervenantID != null){ 
    this.resIntService.formData.DeletedBonIntervenantIDs += BonIntervenantID + ",";
  }
  this.resIntService.reservedintervenants.splice(i, 1);
}







}
