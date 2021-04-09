import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment'
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private http: HttpClient) { }

  getUsersPosts(posts?){
    var body={posts:posts};
    return this.http.post<any>(environment.apiUrl+'/generale/getUsersPosts',body).toPromise();;
  }

  getIntervenants(){
    //var body={posts:posts};
    return this.http.get<any>(environment.apiUrl+'/generale/getIntervenants').toPromise();
  }

  ModificationDate(id:number,whattoedit:string,date){
    var body={id:id,whattoedit:whattoedit,date:date};
    return this.http.post<any>(environment.apiUrl+'/generale/ModificationDate',body).toPromise();
  }
  


}
