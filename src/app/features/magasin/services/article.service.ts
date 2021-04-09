import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { TreeNode } from 'angular-tree-component';

import { delay, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private _http:HttpClient) { }

  getArticleListSearch(search:string){
    var body = {search:search};
    return this._http.post(environment.apiUrl+'/magasin/article/articles',body).toPromise();
   }

   getArticleAtelierListSearch(search:string){
    var body = {search:search};
    return this._http.post(environment.apiUrl+'/magasin/article/getArticleAtelierListSearch',body).toPromise();
   }



   getListeSousFamilles(e:number){
    return this._http.get<any>(environment.apiUrl+'/magasin/article/getlistesousfamilles/'+e).toPromise();
   }

   getFamilles(){
    return this._http.get<any>(environment.apiUrl+'/magasin/article/getfamilles').toPromise();
   }

   getEmplacements(){
    return this._http.get<any>(environment.apiUrl+'/magasin/article/getemplacements').toPromise();
   }

   getUnites(){
    return this._http.get<any>(environment.apiUrl+'/magasin/article/getunites').toPromise();
   }
   

   


getForm(FamCaraID:number){
    return this._http.get(environment.apiUrl+'/magasin/article/getform/'+FamCaraID).toPromise();
}

getformFilter(FamCaraID:number){
  return this._http.get(environment.apiUrl+'/magasin/article/getformfilter/'+FamCaraID).toPromise();
}

setForm(formValue){
  return this._http.post<any>(environment.apiUrl+'/magasin/article/setform',formValue).toPromise();
}

submitArticle(articleForm,CaraForm){
   var body={
     article_form:articleForm,
     cara_form:CaraForm
  }
  return this._http.post<any>(environment.apiUrl+'/magasin/article/addarticle',body).toPromise();
}

getArticle(ArticleID:number){
  return this._http.get<any>(environment.apiUrl+'/magasin/article/getarticle/'+ArticleID).toPromise();
}

GetArticle(ArticleID:number,source:string){
  var body = {source:source};
  return this._http.post<any>(environment.apiUrl+'/magasin/article/getarticle/'+ArticleID,body).toPromise();
}

EditArticle(articleForm,CaraForm,ArticleID:number){
  var body={
    article_form:articleForm,
    cara_form:CaraForm
 }
 return this._http.post<any>(environment.apiUrl+'/magasin/article/editarticle/'+ArticleID,body).toPromise();
}


getFiles(i:number){
  return this._http.get(environment.apiUrl+'/magasin/article/getfiles/'+i).toPromise();
}

/*
getArticles(){
  return this._http.get(environment.apiUrl+'/magasin/article/getarticles/').toPromise();
}*/

getArticles(page:number,itemsPerPage:number,staticfilter,dynamicfilter,exist:number){
  var post={page:page,itemsPerPage:itemsPerPage,staticfilter:staticfilter,dynamicfilter:dynamicfilter};
  return this._http.post<any>(environment.apiUrl+'/magasin/article/getarticles/'+exist,post).toPromise();
}



filterArticle(form,exist:number){
  return this._http.post(environment.apiUrl + '/magasin/article/articlefilter/'+exist ,form).toPromise();
}


getArticlesPerPage(nb,p):Observable<any>{
  var body={nb:nb,p:p};
  return this._http.post<any>(environment.apiUrl + '/magasin/article/getArticlesPerPage',body);
}



}
