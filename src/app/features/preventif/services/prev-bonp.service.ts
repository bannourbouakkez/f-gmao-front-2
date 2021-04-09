import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrevBonpService {

  bonpintervenants=<any>[];
  formData;
  constructor(private _http:HttpClient) { }

  getBonp(OtpID:number,BonpID:number){
    var body={OtpID:OtpID,BonpID:BonpID};
    return this._http.post<any>(environment.apiUrl+'/preventif/bonp/getBonp',body).toPromise();
  }

  getBonpForAff(BonpID:number){ 
    return this._http.get<any>(environment.apiUrl+'/preventif/bonp/getBonpForAff/'+BonpID).toPromise();
  }

  addBonp(OtpID:number,formData:any,bonpintervenants,articles){
    var body = {
      ...this.formData,
      BonIntervenants: this.bonpintervenants,
      articles:articles
    };
    return this._http.post<any>(environment.apiUrl + '/preventif/bonp/addBonp/'+OtpID, body).toPromise();
  }

  editBonp(BonpID:number,formData:any,bonpintervenants,articles){
    var body = {
      ...this.formData,
      BonIntervenants: this.bonpintervenants,
      articles:articles
    };
    return this._http.post<any>(environment.apiUrl + '/preventif/bonp/editBonp/'+BonpID, body).toPromise();
  }

  getBonps(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/preventif/bonp/getBonps',body).toPromise();
  }

 
  

  isAllCompletedIncludeTache(){
    for(let i=0;i<this.bonpintervenants.length;i++){
      if(!this.isCompletedIncludeTache(i)){
       return false;
      }
    }
    return true;
  }

  isCompletedIncludeTache(i:number){
    let intervenant_id=this.bonpintervenants[i].intervenant_id;
    let tache_id=this.bonpintervenants[i].tache_id;
    if(intervenant_id==null || intervenant_id==undefined 
      || tache_id==null ||tache_id==undefined 
      || !this.isDateTimeCompleted(i)){
      return false;
    }
    return true;
  }




  isAllCompleted(){
    for(let i=0;i<this.bonpintervenants.length;i++){
      if(!this.isCompleted(i)){
       return false;
      }
    }
    return true;
  }
  isCompleted(i:number){
    let intervenant_id=this.bonpintervenants[i].intervenant_id;
    let tache_id=this.bonpintervenants[i].tache_id;
    if(intervenant_id==null || intervenant_id==undefined 
      //|| tache_id==null ||tache_id==undefined 
      || !this.isDateTimeCompleted(i)){
      return false;
    }
    return true;
  }
  isDateTimeCompleted(i:number){
    let date1=this.bonpintervenants[i].date1;
    let time1=this.bonpintervenants[i].time1;
    let date2=this.bonpintervenants[i].date2;
    let time2=this.bonpintervenants[i].time2;
  
    if(date1==null || date1==undefined || time1==null ||time1==undefined || date2==null || date2==undefined || time2==null || time2 == undefined ){
      return false;
    }
    return true;
  }






}
