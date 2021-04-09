import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiService {

  constructor(private http: HttpClient) { }

  addoreditDi(form,DiID:number){
    var body={form:form,DiID:DiID};

    if(!(DiID>0)){
     return this.http.post<any>(environment.apiUrl+'/correctif/di/addDi',body).toPromise();
    }else{
     return this.http.post<any>(environment.apiUrl+'/correctif/di/editDi/'+DiID,body).toPromise();
    }
  }

  getDi(DiID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/getDi/'+DiID).toPromise();
  }

  getDiForAffichage(DiID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/getDiForAffichage/'+DiID).toPromise();
  }

  getDis(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this.http.post<any>(environment.apiUrl+'/correctif/di/getDis',body).toPromise();
  }

  deleteDi(DiID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/deleteDi/'+DiID).toPromise();
  }


  
  planifierDi(PlanID:number,form){
    var body={form:form};
    return this.http.post<any>(environment.apiUrl+'/correctif/di/planifierDi/'+PlanID,body).toPromise();
  }

  deplanifierDi(PlanID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/deplanifierDi/'+PlanID).toPromise();
  }

  getPlan(PlanID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/getPlan/'+PlanID).toPromise();
  }

  getPlans(){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/getPlans').toPromise();
  }

  
  getPlansForList(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this.http.post<any>(environment.apiUrl+'/correctif/di/getPlansForList',body).toPromise();
  }

  getEventsPlans(body){
    return this.http.post<any>(environment.apiUrl+'/correctif/di/getEventsPlans',body);//.subscribe();//.toPromise();
  }

  executerPlan(PlanID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/di/executerPlan/'+PlanID).toPromise();
  }
  
  systemePlanAutoToOt(PlanID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/plan/systemePlanAutoToOt/'+PlanID).toPromise();
  }


  /*
  syestemePlans(){
    return this.http.get<any>(environment.apiUrl+'/correctif/plan/syestemePlans').toPromise();
  }
  */
  
  

}
