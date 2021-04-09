import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  apiUrl=environment.apiUrl;
  constructor(private _http:HttpClient) { }

  addoredit(forurnisseur){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    //this.http.post(environment.apiUrl+'/upload/', myFormData, {headers: headers})
    const n=toFormData(forurnisseur);
    console.log("toFormData(forurnisseur)"+JSON.stringify(n) );
    return this._http.post(this.apiUrl+'/achat/fournisseurs',toFormData(forurnisseur),{headers: headers} ).toPromise();
  }

  getFournisseurs(){
    return this._http.get(this.apiUrl+'/achat/fournisseurs').toPromise();
  }

  getFournisseur(i:number){
    return this._http.get(this.apiUrl+'/achat/fournisseur/'+i).toPromise();
  }

  getFiles(i:number){
    return this._http.get(this.apiUrl+'/achat/fournisseurs/files/'+i).toPromise();
  }

  //===============================> modes 

  addoreditmode(mode){
    return this._http.post(this.apiUrl+'/achat/modes',mode).toPromise();
  }
  getModes(){
    return this._http.get(this.apiUrl+'/achat/modes').toPromise();
  }
  getMode(id:number){
    return this._http.get(this.apiUrl+'/achat/modes/'+id).toPromise();
  }
  deleteMode(id:number){
    return this._http.delete(this.apiUrl+'/achat/modes/'+id).toPromise();
  }

  //=============================> secterus
  //===============================> modes 

  addoreditsecteur(mode){
    return this._http.post(this.apiUrl+'/achat/secteurs',mode).toPromise();
  }
  getSecteurs(){
    return this._http.get(this.apiUrl+'/achat/secteurs').toPromise();
  }
  getSecteur(id:number){
    return this._http.get(this.apiUrl+'/achat/secteurs/'+id).toPromise();
  }

  deleteSecteur(id:number){
    return this._http.delete(this.apiUrl+'/achat/secteurs/'+id).toPromise();
  }


}


export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    var value = formValue[key];
    if(value==null){value='';}
    formData.append(key, value);
  }

  return formData;
}

