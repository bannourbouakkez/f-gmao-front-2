import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { BsooService } from '../../correctif/services/bsoo.service';

@Injectable({
  providedIn: 'root'
})
export class MagBsoService {

  constructor(private _http:HttpClient,private bsoService:BsooService) { }

  getBso(BsoID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl+'/magasin/bso/getBso/'+BsoID,body).toPromise();
  }

  getBsos(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/magasin/bso/getBsos',body).toPromise();
  }

  acceptBso(BsoID:number,message:string,array:any){
    var body={
      message:message,
      array:array
    }
    return this._http.post<any>(environment.apiUrl+'/magasin/bso/acceptBso/'+BsoID,body).toPromise();
  }

  getBsoWithResponse(BsoID:number,Src:string){
   return this.bsoService.getBsoWithResponse(BsoID,Src);
  }


  
  termineUtilisation(BsoID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/use/termineUtilisation/'+BsoID).toPromise();
  }

  terminerTous(BsoID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/use/terminerTous/'+BsoID).toPromise();
  }

  getUse(UseID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/use/getUse/'+UseID).toPromise();
  }

  getUse2(UseID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/use/getUse2/'+UseID).toPromise();
  }

  

}
