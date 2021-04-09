import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(type?){
    var body={type:type};
    return this.http.post<any>(environment.apiUrl+'/generale/getUsers',body).toPromise();;
  }

}
