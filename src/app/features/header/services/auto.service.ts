
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutoService {

  constructor(private _http:HttpClient) { }

  syestemePlans(){
    //console.log('test');
    return this._http.get<any>(environment.apiUrl+'/correctif/plan/syestemePlans').toPromise();
  }
  
}
