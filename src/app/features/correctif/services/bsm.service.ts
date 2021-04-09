import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BsmService {

  bsmarticles=<any>[];
  formData;

  constructor(private _http:HttpClient) { }

  getBsmByID(BsmID:number,Src){
    var body={Src:Src}
    return this._http.post<any>(environment.apiUrl + '/correctif/bsm/getBsmByID/'+BsmID,body).toPromise();
  }
  

  addBsm(OtID:number,formData:any,bsmarticles,Src){
    var body = {
      ...this.formData,
      BsmArticles: this.bsmarticles,
      Src:Src
    };
    return this._http.post<any>(environment.apiUrl + '/correctif/bsm/addBsm/'+OtID, body).toPromise();
  }

  editBsm(BsmID:number,Src){
    var body = {
      ...this.formData,
      BsmArticles: this.bsmarticles,
      Src:Src
    };
    
    return this._http.post<any>(environment.apiUrl + '/correctif/bsm/editBsm/'+BsmID, body).toPromise(); 
  }

  getBsms(OtID:number){
    return this._http.get<any>(environment.apiUrl + '/correctif/bsm/getBsms/'+OtID).toPromise(); 
  }

  
  getBsm(BsmID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/bsm/getBsm/'+BsmID).toPromise();
  }

  getBsmWithResponse(BsmID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl+'/correctif/bsm/getBsmWithResponse/'+BsmID,body).toPromise();
  }

  // _______________  tebe3 preventif 

  addReservationBsm(OtpID:number){
    var body = {
      ...this.formData,
      BsmArticles: this.bsmarticles
    };
    return this._http.post<any>(environment.apiUrl + '/preventif/otp/addReservationBsm/'+OtpID, body).toPromise();
  }

  editReservationBsm(ReservationID:number){
    var body = {
      ...this.formData,
      BsmArticles: this.bsmarticles 
    };
    return this._http.post<any>(environment.apiUrl + '/preventif/otp/editReservationBsm/'+ReservationID, body).toPromise(); 
  }

  getReservationBsmByID(ReservationID:number){
    var body={}
    return this._http.post<any>(environment.apiUrl + '/preventif/otp/getReservationBsmByID/'+ReservationID,body).toPromise();
  }
  
  // ___ ###############################


  deleteBsm(BsmID:number,cp:string){
    var body={cp:cp};
    return this._http.post<any>(environment.apiUrl+'/correctif/bsm/deleteBsm/'+BsmID,body).toPromise();
  }
  

}
