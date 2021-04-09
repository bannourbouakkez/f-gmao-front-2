import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OutilService {

  constructor(private _http:HttpClient) { }

/*
  Justtest(){
    return this._http.get<any>(environment.apiUrl+'/magasin/article/getfamilles').toPromise();
   }
*/

getOutilAndTables(OutilID?:number,source?:string){
    var body={source:source};
    return this._http.post<any>(environment.apiUrl+'/magasin/outils/getOutilTables/'+OutilID,body).toPromise();
}

addOutil(OutilForm,ListeValueUtilisations){
  var body={
    OutilForm:OutilForm,
    ListeValueUtilisations:ListeValueUtilisations
  }
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/addOutil',body).toPromise();
}

getFiles(i:number){
  return this._http.get(environment.apiUrl+'/magasin/outils/getfiles/'+i).toPromise();
}

EditOutil(OutilForm,ListeValueUtilisations,OutilID:number){
  var body={OutilForm:OutilForm,ListeValueUtilisations:ListeValueUtilisations}
 return this._http.post<any>(environment.apiUrl+'/magasin/outils/editOutil/'+OutilID,body).toPromise();
}


getUseAndTables(UseID?:number,source?:string){
  var body={source:source};
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/getUseAndTables/'+UseID,body).toPromise();
}

addUse(UseForm){
  var body={UseForm:UseForm};
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/addUse',body).toPromise();
}

editUse(UseForm,UseID:number){
  var body={UseForm:UseForm};
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/editUse/'+UseID,body).toPromise();
}


getUses(page:number,itemsPerPage:number,filter,corbeille){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl+'/magasin/outils/getUses/'+corbeille,body).toPromise();
}

filterUses(filterForm,corbeille:number){
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/filterUses/'+corbeille,filterForm).toPromise();
}

Cloture(UseID:number){
  return this._http.get<any>(environment.apiUrl+'/magasin/outils/Cloture/'+UseID).toPromise();
}

getOutils(page:number,itemsPerPage:number,filter,corbeille){
  var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/getOutils/'+corbeille,body).toPromise();
}


filterOutils(filterForm,corbeille:number){
  return this._http.post<any>(environment.apiUrl+'/magasin/outils/filterOutils/'+corbeille,filterForm).toPromise();
}


deleteUse(UseID:number){
  return this._http.get<any>(environment.apiUrl+'/magasin/outils/deleteUse/'+UseID).toPromise();
}

deleteOutil(OutilID:number){
  return this._http.get<any>(environment.apiUrl+'/magasin/outils/deleteOutil/'+OutilID).toPromise();
}


}
