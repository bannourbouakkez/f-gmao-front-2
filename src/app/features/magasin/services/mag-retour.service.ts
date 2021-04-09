import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MagRetourService {

  constructor(private _http:HttpClient) { }

  getRetour(RetourID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl+'/magasin/retour/getRetour/'+RetourID,body).toPromise();
  }

  addRetour(RetourID:number,retours,Src:string){
    var body={retours:retours,Src:Src};
    return this._http.post<any>(environment.apiUrl+'/magasin/retour/addRetour/'+RetourID,body).toPromise();
  }

  getRetours(page:number,itemsPerPage:number,filter){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl+'/magasin/retour/getRetours',body).toPromise();
  }

  
  getRetourForAff(RetourID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl+'/magasin/retour/getRetourForAff/'+RetourID,body).toPromise();
  }

  


}
