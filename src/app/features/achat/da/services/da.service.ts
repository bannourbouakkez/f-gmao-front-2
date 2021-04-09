import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DaService {
  daarticles=<any>[];
  formData;
  constructor(private _http:HttpClient,private _authService:AuthService) { }

  // Nv kammalt el article w rja3t bil 5ebra hh
   
  nvGetDa(DaID:number){
    return this._http.get<any>(environment.apiUrl + '/achat/da/nvGetDa/'+DaID).toPromise();
  }

  //#####################

  saveDa(){
    var body = {
      ...this.formData,
      DaArticles: this.daarticles
    };
    console.log('saveDa body = '+JSON.stringify(body));
    return this._http.post<any>(environment.apiUrl + '/achat/da/addda', body);
  }

  getDaByID(DaID){
    return this._http.get<any>(environment.apiUrl + '/achat/da/das/'+DaID).toPromise();
  }


  updateDa(){
    var body = {
      ...this.formData,
      DaArticles: this.daarticles
    };
    return this._http.post<any>(environment.apiUrl + '/achat/da/updateda', body);
  }

  /*
  getDas(statut){
    if(statut==null) return this._http.get(environment.apiUrl + '/achat/gererda/das');
    else return this._http.get(environment.apiUrl + '/achat/gererda/das/'+statut);
  }
  */


  action(action:string,DaID:number,message:string,delaidereportation){
    var body ={
      action:action,
      message:message,
      delaidereportation:delaidereportation
      }

     if(this._authService.isPoste('ResponsableAchat')){
      return this._http.post(environment.apiUrl + '/achat/gererda/action/responsableachat/'+DaID , body ).toPromise();
     }

     if(this._authService.isPoste("Admin")){
      return this._http.post(environment.apiUrl + '/achat/gererda/action/admin/'+DaID , body ).toPromise();
     }
  }

 

  checkDasReportees(){
    return this._http.get(environment.apiUrl + '/achat/gererda/action/checkreporte' ).toPromise();
  }


  getDas(page:number,itemsPerPage:number,filter,statut){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl + '/achat/gererda/filter',body).toPromise();
    
    /*
    if(statut==null) return this._http.get(environment.apiUrl + '/achat/gererda/das');
    else return this._http.get(environment.apiUrl + '/achat/gererda/das/'+statut);
    */

  }




}
