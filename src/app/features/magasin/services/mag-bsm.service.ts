import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MagBsmService {

  constructor(private _http:HttpClient) { }

  getBsm(BsmID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl+'/magasin/bsm/getBsm/'+BsmID,body).toPromise();
  }

  getBsms(page:number,itemsPerPage:number,filter,nodes){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter,nodes:nodes};
    return this._http.post<any>(environment.apiUrl+'/magasin/bsm/getBsms',body).toPromise();
  }
  
  acceptBsm(BsmID:number,isRefused:boolean,Reason:string,array:any,Src:String){
    var body={
      Src:Src,
      isRefused:isRefused,
      Reason:Reason,
      array:array
    }
    return this._http.post<any>(environment.apiUrl+'/magasin/bsm/acceptBsm/'+BsmID,body).toPromise();
  }

  
}
