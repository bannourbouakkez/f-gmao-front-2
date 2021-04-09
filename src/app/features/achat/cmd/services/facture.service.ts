import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private _http:HttpClient) { }

  getFournisseursHasNonFacturedBons(){
    return this._http.get<any>(environment.apiUrl+'/achat/cmd/getFoursHasNonFacturedBons').toPromise();
  }

  getFournisseurBons(page:number,itemsPerPage:number,filter,FournisseurID:number){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl+'/achat/cmd/getFournisseurBons/'+FournisseurID,body).toPromise();
  }
  
  addFacFilter(form,FournisseurID:number){
    return this._http.post(environment.apiUrl + '/achat/cmd/addFouFilter/'+FournisseurID , form).toPromise();
  }

  Facturer(BonsIds,FournisseurID:number){
    var body={BonsIds:BonsIds};
    return this._http.post<any>(environment.apiUrl+'/achat/cmd/facturer/'+FournisseurID,body).toPromise();
  }

  getFacture(FactureID:number){
    return this._http.get<any>(environment.apiUrl+'/achat/cmd/getFacture/'+FactureID).toPromise();
  }

  getListeFactures(){
    return this._http.get<any>(environment.apiUrl+'/achat/cmd/factures').toPromise();
  }
  
  
  filterFactures(page:number,itemsPerPage:number,filter,corbielle:number){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl + '/achat/cmd/factureFilter/'+corbielle , body).toPromise();
  }

  suprimerFacture(FactureID:number){
    return this._http.get(environment.apiUrl + '/achat/cmd/suprimerFacture/'+FactureID).toPromise();
  }

  restaurerFacture(FactureID:number){
    return this._http.get(environment.apiUrl + '/achat/cmd/restaurerFacture/'+FactureID).toPromise();
  }


}
