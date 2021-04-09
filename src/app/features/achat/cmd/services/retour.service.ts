import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RetourService {

  constructor(private _http:HttpClient) { }

  addRetour(CmdRecID:number,retour,causes:string){
    var body={
      retour:retour,
      causes:causes
    }
    return this._http.post<any>(environment.apiUrl+'/achat/cmd/addRetour/'+CmdRecID,body).toPromise();
  }
  
  getRetour(RetourID:number){
    return this._http.get<any>(environment.apiUrl+'/achat/cmd/getRetour/'+RetourID).toPromise();
  }

  deleteRetour(RetourID:number){
    return this._http.get<any>(environment.apiUrl+'/achat/cmd/deleteRetour/'+RetourID).toPromise();
  }

  getRetours(corbeille:number){
    return this._http.get<any>(environment.apiUrl+'/achat/cmd/getRetours/'+corbeille).toPromise();
  }

  filterRetours(page:number,itemsPerPage:number,filter,corbeille:number){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl+'/achat/cmd/filterRetours/'+corbeille,body).toPromise();
  }

}
