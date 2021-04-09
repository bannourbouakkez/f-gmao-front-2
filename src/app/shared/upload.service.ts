import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs";
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  apiUrl=environment.apiUrl;
  constructor(private _http:HttpClient) { }

/*
  uploadFile(data: FormData){
  return this._http.post('http://localhost:8000/api/files/upload', data).toPromise();
  }
*/

    uploadFile(data: FormData,DossierID:number): Observable<HttpEvent<any>> {
    let params = new HttpParams();
    const options = {
      params: params,
      reportProgress: true,
    };
    const req = new HttpRequest('POST', this.apiUrl+'/files/upload/'+DossierID, data, options);
    return this._http.request(req);
   }

   CreerUnDossier(nom,type,des,lien){
    var body={
      nom:nom,
      type:type,
      des:des,
      lien:lien
    }
    return this._http.post<any>(this.apiUrl+'/files/creerundossier',body).toPromise();
   }

   removeFile(i:number){
    return this._http.delete<any>(this.apiUrl+'/files/remove/'+i).toPromise();
   }

    getFiles(i:number){
      return this._http.get(environment.apiUrl+'/files/getfiles/'+i).toPromise();
   }


}
