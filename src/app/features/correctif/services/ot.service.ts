import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OtService {

  constructor(private http: HttpClient) { }

  addOt(form,intervenants,isSystem:number){
    var body={form:form,intervenants:intervenants};
    return this.http.post<any>(environment.apiUrl+'/correctif/ot/addOt/'+isSystem,body).toPromise();
  }

  getOt(DiID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/ot/getOt/'+DiID).toPromise();
  }

  getOts(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    //return this.http.post<any>(environment.apiUrl+'/correctif/di/getDis',body).toPromise();
    return this.http.post<any>(environment.apiUrl+'/correctif/ot/getOts',body).toPromise();
  }
  
  editOt(form,intervenants,OtID){
    var body={form:form,intervenants:intervenants};
    return this.http.post<any>(environment.apiUrl+'/correctif/ot/editOt/'+OtID,body).toPromise();
  }

  getBon(OtID:number,BonID:number){
    var body={OtID:OtID,BonID:BonID};
    return this.http.post<any>(environment.apiUrl+'/correctif/bon/getBon',body).toPromise();
  }

  deleteOt(OtID:number){
    return this.http.get<any>(environment.apiUrl+'/correctif/ot/deleteOt/'+OtID).toPromise();
  }
   


}
