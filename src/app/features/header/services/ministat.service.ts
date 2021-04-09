
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MinistatService {

  constructor(private _http:HttpClient) { }

  CountDi(){
    //console.log('CountDi1'); // ma témchich console 
    return this._http.get<any>(environment.apiUrl+'/mypages/countDi');//.toPromise();
  }
  

}
