import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InventaireService {

  constructor(private _http:HttpClient) { }

  getArticlesHasSFamID(SouFamilleID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/inventaire/getArticlesHasSFamID/'+SouFamilleID).toPromise();
  }

  getArticlesByArtIDs(ArtIDs){
  var body={ArtIDs:ArtIDs};
  return this._http.post<any>(environment.apiUrl+'/magasin/inventaire/getArticlesByArtIDs',body).toPromise();
  }

  inventaire(arr,InterIDs,type){
    var body={arr:arr,InterIDs:InterIDs,type:type};
    return this._http.post<any>(environment.apiUrl+'/magasin/inventaire/inventaire',body).toPromise();
  }

  getIntervenantsByIntervenantsIDs(InterIDs){
    var body={InterIDs:InterIDs};
    return this._http.post<any>(environment.apiUrl+'/magasin/inventaire/getIntervenantsByInterIDs',body).toPromise();
  }

  getInventaire(InventaireID:number){
      return this._http.get<any>(environment.apiUrl+'/magasin/inventaire/getInventaire/'+InventaireID).toPromise();
  }

  getInventaires(){
    return this._http.get<any>(environment.apiUrl+'/magasin/inventaire/getInventaires').toPromise();
  }

  filterInventaires(filterForm){
    return this._http.post<any>(environment.apiUrl+'/magasin/inventaire/filterInventaires',filterForm).toPromise();
  }

  correction(InventaireID:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/inventaire/correction/'+InventaireID).toPromise();
  }


}
