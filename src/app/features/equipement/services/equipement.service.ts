import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EquipementService {

  constructor(private _http:HttpClient) { }

  /*
  getArticleListSearch(search:string){
    var body = {search:search};
    return this._http.post(environment.apiUrl+'/equipement/articles',body).toPromise();
   }
  */

 getNodeDet(NodeID:number){
    return this._http.get<any>(environment.apiUrl+'/equipement/getNodeDet/'+NodeID).toPromise();
 }

 getNiveauMax(){
  return this._http.get<any>(environment.apiUrl+'/equipement/getNiveauMax').toPromise();
 }

 getArbre(){
  return this._http.get(environment.apiUrl+'/equipement/getNode/'+1).toPromise();
 }

 
 getNodeJustChilds(NodeID:number){
  return this._http.get(environment.apiUrl+'/equipement/getNodeJustChilds/'+NodeID).toPromise();
 }


 getNodeByNodeIDAndByNiveau(NodeID:number,niveau:number){
  var body={niveau:niveau};
  return this._http.post(environment.apiUrl+'/equipement/getNodeByNodeIDAndByNiveau/'+NodeID,body).toPromise();
 }

 getRacine(niveau:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getRacine/'+niveau).toPromise();
 }

 getNodeRacine(NodeID:number,niveau:number){
  var body={niveau:niveau};
  return this._http.post(environment.apiUrl+'/equipement/getNodeRacine/'+NodeID,body).toPromise();
 }


  
addEquipement(ParentID:number,name:string){
  var body={name:name};
  return this._http.post(environment.apiUrl+'/equipement/addEquipement/'+ParentID,body).toPromise();
}

deleteEquipement(ParentID:number){
  return this._http.get(environment.apiUrl+'/equipement/deleteEquipement/'+ParentID).toPromise();
}


getAnomalie(AnomalieID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getAnomalie/'+AnomalieID).toPromise();
}

getTache(TacheID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getTache/'+TacheID).toPromise();
}

addAnomalie(TacheID:number,form,nodes){
  var body={TacheID:TacheID,form:form,nodes:nodes};
  return this._http.post<any>(environment.apiUrl+'/equipement/addAnomalie/'+TacheID,body).toPromise();
}

addTache(TacheID:number,form,nodes){
  var body={TacheID:TacheID,form:form,nodes:nodes};
  return this._http.post<any>(environment.apiUrl+'/equipement/addTache/'+TacheID,body).toPromise();
}


getAnomalieSemblables(value:string,strict:number){
  var body={value:value,strict:strict};
  return this._http.post<any>(environment.apiUrl+'/equipement/getSemblables/anomalies',body).toPromise();
}

getTacheSemblables(value:string,strict:number){
  var body={value:value,strict:strict};
  return this._http.post<any>(environment.apiUrl+'/equipement/getSemblables/taches',body).toPromise();
}

getListeAnomalies(){
  return this._http.get<any>(environment.apiUrl+'/equipement/getListeAnomalies').toPromise();
}

filterAnomalie(form,nodes){
  var body={form:form,nodes:nodes};
  return this._http.post<any>(environment.apiUrl+'/equipement/filterAnomalie',body).toPromise();
}

FusionnerAnomalie(name,description,anomalies){
 var body={name:name,description:description,anomalies:anomalies};
 return this._http.post<any>(environment.apiUrl+'/equipement/FusionnerAnomalie',body).toPromise();
}

FusionnerTache(name,description,tache){
  var body={name:name,description:description,tache:tache};
  return this._http.post<any>(environment.apiUrl+'/equipement/FusionnerTache',body).toPromise();
 }

anomalieSearch(search:string){
  var body = {search:search};
  return this._http.post(environment.apiUrl+'/equipement/anomalieSearch',body).toPromise();
}

getAnomaliesByEquipementID(EquipementID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getAnomaliesByEquipementID/'+EquipementID).toPromise();
}
getTachesByEquipementID(EquipementID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getTachesByEquipementID/'+EquipementID).toPromise();
}

getNiveauDetByEquipementID(EquipementID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getNiveauDetByEquipementID/'+EquipementID).toPromise();
}





datetimetest(form){
  return this._http.post<any>(environment.apiUrl+'/equipement/datetimetest',form).toPromise();
}

affectDateTime(DateTimeID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/affectDateTime/'+DateTimeID).toPromise();
}



getAllDetEquipement(EquipementID:number){
  return this._http.get<any>(environment.apiUrl+'/equipement/getAllDetEquipement/'+EquipementID).toPromise();
}

editEquipement(EquipementID:number,form){
  var body = {form:form};
  return this._http.post<any>(environment.apiUrl+'/equipement/editEquipement/'+EquipementID,body).toPromise();
}


AddOrEditEquipementArticle(EquipementID:number,formData:any,articlesMagasin,articlesAtelier){
  var body = {
    ...formData,
    articlesMagasin: articlesMagasin,
    articlesAtelier: articlesAtelier
  };
  return this._http.post<any>(environment.apiUrl + '/equipement/AddOrEditEquipementArticle/'+EquipementID, body).toPromise();
}




}
