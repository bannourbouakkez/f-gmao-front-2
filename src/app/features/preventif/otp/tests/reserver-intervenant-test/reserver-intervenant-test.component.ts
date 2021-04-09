import { Component, OnInit } from '@angular/core';
import { PrevBonpService } from '../../../services/prev-bonp.service';
import { PrevResIntService } from '../../otp-reservation-intervenants/prev-res-int.service';

@Component({
  selector: 'app-reserver-intervenant-test',
  templateUrl: './reserver-intervenant-test.component.html',
  styleUrls: ['./reserver-intervenant-test.component.scss']
})
export class ReserverIntervenantTestComponent implements OnInit {



OtpID:number=1; 
IntReservationID:number=6;
DateTimeOTp:string='date/date/date';
local_2_reservedintervenants=<any>[];
loaded=false;

  constructor(private testService:PrevResIntService) { }
  
  ngOnInit() {

    //this.DateTimeOTp="2020-07-15";
    //this.loaded=true;
    
    this.testService.getIntReservation(this.IntReservationID).then(
      res=>{
        
        if(res.reservedintervenants.length>0){
        for(let i=0;i<res.reservedintervenants.length;i++){
          this.local_2_reservedintervenants.push(res.reservedintervenants[i]);
        } 
        }
        
        this.DateTimeOTp=res.date_execution;
        this.loaded=true;
        
      },
      err=>console.log()
    );

    

  }

  getIntReservationID(e){
   this.IntReservationID=e;
  }


  submit(){
    console.log(this.testService.reservedintervenants);
    console.log(this.testService.formData);
    console.log(this.OtpID);
  }
  


}
