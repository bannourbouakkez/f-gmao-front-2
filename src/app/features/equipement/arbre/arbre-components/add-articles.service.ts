import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddArticlesService {

  articlesMagasin=<any>[];
  articlesAtelier=<any>[];
  formData;

  constructor(private _http:HttpClient) { }

  getArticleMagasinListSearch(search:string){
     return [{ArticleID:1,des:'article1'},{ArticleID:2,des:'article2'}];
  }

  getArticlesMagasinAtelierByEquipementID(EquipementID:number){
    return this._http.get<any>(environment.apiUrl + '/equipement/getArticlesMagasinAtelierByEquipementID/'+EquipementID).toPromise();
  }

  /*
  AddOrEditEquipementArticle(EquipementID:number,formData:any,articlesMagasin,articlesAtelier){
    var body = {
      ...formData,
      articlesMagasin: articlesMagasin,
      articlesAtelier: articlesAtelier
    };
    return this._http.post<any>(environment.apiUrl + '/equipement/AddOrEditEquipementArticle/'+EquipementID, body).toPromise();
  }
  */






  /*
  getBsmByID(BsmID:number){
    return this._http.get<any>(environment.apiUrl + '/correctif/bsm/getBsmByID/'+BsmID).toPromise();
  }
  

  addBsm(OtID:number,formData:any,bsmarticles){
    var body = {
      ...this.formData,
      BsmArticles: this.bsmarticles
    };
    return this._http.post<any>(environment.apiUrl + '/correctif/bsm/addBsm/'+OtID, body).toPromise();
  }
  */


}
