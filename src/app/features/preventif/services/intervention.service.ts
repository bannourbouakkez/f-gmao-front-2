import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  constructor(private _http:HttpClient) { }


  addIntervention(form:any){
    var body = {form:form};
    return this._http.post<any>(environment.apiUrl+'/preventif/intervention/addIntervention',body).toPromise();
  }

  editIntervention(form:any,InterventionID:number){
    var body = {form:form};
    return this._http.post<any>(environment.apiUrl+'/preventif/intervention/editIntervention/'+InterventionID,body).toPromise();
  }

  getIntervention(InventaireID:number){
    return this._http.get<any>(environment.apiUrl+'/preventif/intervention/getIntervention/'+InventaireID).toPromise();
  }
  
  deleteIntervention(InventaireID:number){
    return this._http.get<any>(environment.apiUrl+'/preventif/intervention/deleteIntervention/'+InventaireID).toPromise();
  }

  

  
  getPlans(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/preventif/plan/getPlans',body).toPromise();
  }

  reporterPlan(date,InterventionID:number){
    var body={date:date};
    return this._http.post<any>(environment.apiUrl+'/preventif/plan/reporterPlan/'+InterventionID,body).toPromise();
  }


  getInterventions(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/preventif/intervention/getInterventions',body).toPromise();
  }
  
  
  //-------- Calender 

  getEventsIPs(body){ // Interventions Planifiées
    return this._http.post<any>(environment.apiUrl+'/preventif/plan/getEventsIPs',body);//.subscribe();//.toPromise();
  }

  //#################


  



  


}
