import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CorrBonService {

  bonintervenants=<any>[];
  formData;
  constructor(private _http:HttpClient) { }
  
  getIntervenantsBySearchWord(search:string){
    var body = {search:search};
    return this._http.post(environment.apiUrl+'/generale/getIntervenantsBySearchWord',body).toPromise();
  }

  getTachesBySearchWord(search:string){
    var body = {search:search};
    return this._http.post(environment.apiUrl+'/generale/getTachesBySearchWord',body).toPromise();
  }
  getTachesBySearchWordByEquipementID(search:string,EquipementID:number){
    var body = {search:search,EquipementID:EquipementID};
    return this._http.post(environment.apiUrl+'/generale/getTachesBySearchWordByEquipementID',body).toPromise();
  }
  getTachesBySearchWordByInterventionID(search:string,InterventionID:number){
    var body = {search:search,InterventionID:InterventionID};
    return this._http.post(environment.apiUrl+'/generale/getTachesBySearchWordByInterventionID',body).toPromise();
  }

  

  addBon(OtID:number,formData:any,bonintervenants,articles){
    var body = {
      ...this.formData,
      BonIntervenants: this.bonintervenants,
      articles:articles
    };
    return this._http.post<any>(environment.apiUrl + '/correctif/bon/addBon/'+OtID, body).toPromise();
  }

  editBon(BonID:number,formData:any,bonintervenants,articles){
    var body = {
      ...this.formData,
      BonIntervenants: this.bonintervenants,
      articles:articles
    };
    return this._http.post<any>(environment.apiUrl + '/correctif/bon/editBon/'+BonID, body).toPromise();
  }

  
  getBons(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/correctif/bon/getBons',body).toPromise();
  }

  getBon(BonID:number){
    return this._http.get<any>(environment.apiUrl+'/correctif/bon/getBonForAff/'+BonID).toPromise();    
  }

  getBonForAff2(BonID:number){
  return this._http.get<any>(environment.apiUrl+'/correctif/bon/getBonForAff2/'+BonID).toPromise();
  }

  


  isDateTimeCompleted(i:number){
    let date1=this.bonintervenants[i].date1;
    let time1=this.bonintervenants[i].time1;
    let date2=this.bonintervenants[i].date2;
    let time2=this.bonintervenants[i].time2;
  
    if(date1==null || date1==undefined || time1==null ||time1==undefined || date2==null || date2==undefined || time2==null || time2 == undefined ){
      return false;
    }
    return true;
  
  }

  isAllDateTimeCompleted(){
    for(let i=0;i<this.bonintervenants.length;i++){
      if(!this.isDateTimeCompleted(i)){
       return false;
      }
    }
    return true;
  }

  isAllCompleted(){
    for(let i=0;i<this.bonintervenants.length;i++){
      if(!this.isCompleted(i)){
       return false;
      }
    }
    return true;
  }

  isCompleted(i:number){
    let intervenant_id=this.bonintervenants[i].intervenant_id;
    let tache_id=this.bonintervenants[i].tache_id;
    if(intervenant_id==null || intervenant_id==undefined || tache_id==null ||tache_id==undefined || !this.isDateTimeCompleted(i)){
      return false;
    }
    return true;
  }



}
