
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  constructor(private _http:HttpClient) { }

  mynotifications(){
    return this._http.get<any>(environment.apiUrl+'/notification/mynotifications');//.toPromise();
  }

  markAsRead(id){
    return this._http.get<any>(environment.apiUrl+'/notification/markAsRead/'+id).toPromise();
  }

  markAsView(type:string){
    return this._http.get<any>(environment.apiUrl+'/notification/markAsView/'+type).toPromise();
  }
  
}
