import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrevOtpService {

  constructor(private _http:HttpClient) { }

 
  getOtp(InterventionID:number,OtpID:number){
    var body={InterventionID:InterventionID,OtpID:OtpID};
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/getOtp',body).toPromise();
  }

  
  addOtp(InterventionID:number,form,articles_reserved,reservedintervenants){
    var body={InterventionID:InterventionID,form:form,articles_reserved:articles_reserved,reservedintervenants:reservedintervenants};
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/addOtp',body).toPromise();
  }

  editOtp(OtpID:number,form){
    var body={form:form};
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/editOtp/'+OtpID,body).toPromise();
  }

  
  getOtps(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/preventif/otp/getOtps',body).toPromise();
  }


  deleteOtp(OtpID:number){
    return this._http.get<any>(environment.apiUrl+'/preventif/otp/deleteOtp/'+OtpID).toPromise();
  }

  ViderArticlesReserved(ReservationID:number){
    return this._http.get<any>(environment.apiUrl+'/preventif/otp/ViderArticlesReserved/'+ReservationID).toPromise();

  }


}
