import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PrevResIntService {

  aff_zok=<any>[]; 
  reservedintervenants=<any>[];
  formData;

  constructor(private _http:HttpClient) { }

  getBonJustTest(){ 
    return this._http.get<any>(environment.apiUrl+'/preventif/otp/getBonJustTest').toPromise();
  }

  
  isAllCompleted(){
    for(let i=0;i<this.reservedintervenants.length;i++){
      if(!this.isCompleted(i)){
       return false;
      }
    }
    return true;
  }
  isCompleted(i:number){
    let intervenant_id=this.reservedintervenants[i].intervenant_id;
    let tache_id=this.reservedintervenants[i].tache_id;
    if(intervenant_id==null || intervenant_id==undefined 
      //|| tache_id==null ||tache_id==undefined 
      || !this.isDateTimeCompleted(i)){
      return false;
    }
    return true;
  }
  isDateTimeCompleted(i:number){
    let date1=this.reservedintervenants[i].date1;
    let time1=this.reservedintervenants[i].time1;
    let date2=this.reservedintervenants[i].date2;
    let time2=this.reservedintervenants[i].time2;
  
    if(date1==null || date1==undefined || time1==null ||time1==undefined || date2==null || date2==undefined || time2==null || time2 == undefined ){
      return false;
    }
    return true;
  }


  addIntReservation(OtpID:number,reservedintervenants){
    var body={reservedintervenants:this.reservedintervenants}
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/addIntReservation/'+OtpID,body).toPromise();
  }
  
  editIntReservation(IntReservationID:number,reservedintervenants,formData){
    var body={reservedintervenants:this.reservedintervenants,DeletedBonIntervenantIDs:this.formData.DeletedBonIntervenantIDs}
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/editIntReservation/'+IntReservationID,body).toPromise();
  }

  getIntReservation(IntReservationID:number){
    return this._http.get<any>(environment.apiUrl+'/preventif/otp/getIntReservation/'+IntReservationID).toPromise();
  }

  viderIntervenantsReserved(IntReservationID:number){
    return this._http.get<any>(environment.apiUrl+'/preventif/otp/viderIntervenantsReserved/'+IntReservationID).toPromise();
  }

  IsIntReserved(IntervenantID,ReservationIntervenantID,date1,time1,date2,time2){
    var body={IntervenantID:IntervenantID,ReservationIntervenantID:ReservationIntervenantID,date1:date1,date2:date2,time1:time1,time2:time2};
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/IsIntReserved',body).toPromise();
  }
  


}
