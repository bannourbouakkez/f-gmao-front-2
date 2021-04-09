import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BsooService {

  bsoarticles=<any>[];
  formData;

  constructor(private _http:HttpClient) { }

  getOutilsBySearchWord(search:string){
    var body = {search:search};
    return this._http.post(environment.apiUrl+'/generale/getOutilsBySearchWord',body).toPromise();
   }

   addBso(OtID:number,formData:any,bsoarticles,Src:string){
    var body = {
      ...this.formData,
      BsoArticles: this.bsoarticles,
      Src:Src
    };
    return this._http.post<any>(environment.apiUrl + '/correctif/bso/addBso/'+OtID, body).toPromise();
  }

  getBsoByID(BsoID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl + '/correctif/bso/getBsoByID/'+BsoID,body).toPromise();
  }

  /* mabda2iyan zayda just sta3maltha f test 
  getBsos(OtID:number){
    return this._http.get<any>(environment.apiUrl + '/correctif/bso/getBsos/'+OtID).toPromise(); 
  }
  */


  editBso(BsmID:number){    
    var body = {
      ...this.formData,
      BsoArticles: this.bsoarticles,
      
    };
    return this._http.post<any>(environment.apiUrl + '/correctif/bso/editBso/'+BsmID, body).toPromise(); 
    
  }

  deleteBso(BsoID:number,cp:string){
    var body={cp:cp};
    return this._http.post<any>(environment.apiUrl+'/correctif/bso/deleteBso/'+BsoID,body).toPromise();
  }
  
  getBsoWithResponse(BsoID:number,Src:string){
    var body={Src:Src};
    return this._http.post<any>(environment.apiUrl+'/correctif/bso/getBsoWithResponse/'+BsoID,body).toPromise();
  }


  //////////////////////////

  
  addUse(){
    var body = {
      ...this.formData,
      BsoArticles: this.bsoarticles
    };
    return this._http.post<any>(environment.apiUrl + '/magasin/use/addUse', body).toPromise();
  }

  editUse(UseID:number){    
    var body = {
      ...this.formData,
      BsoArticles: this.bsoarticles
    };
    return this._http.post<any>(environment.apiUrl + '/magasin/use/editUse/'+UseID, body).toPromise(); 
    
  }



  

   

}
