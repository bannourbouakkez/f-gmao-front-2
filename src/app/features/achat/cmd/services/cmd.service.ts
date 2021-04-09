import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CmdService {

  apiUrl=environment.apiUrl;
  constructor(private _http:HttpClient) { }

  getFournisseurCmde(){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/fournisseurscmde').toPromise();
  }

  getArticlesCmde(id:number){
    var body={'count':0}
    return this._http.post<any>(this.apiUrl+'/achat/cmd/articlescmde/'+id,body).toPromise();
  }

  addCmd(cmds){
    return this._http.post<any>(this.apiUrl+'/achat/cmd/add',cmds).toPromise();
  }
/*
  getListeCmd(){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/liste').toPromise();
  }
*/
  
  getListeCmd(page:number,itemsPerPage:number,filter,exist:number){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl + '/achat/cmd/cmdfilter/'+exist , body).toPromise();
  }

  getCmd(CommandeID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/cmd/'+CommandeID).toPromise();
  }

  cmdCorbeille(){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/corbeille').toPromise();
  }

  supprimerCmd(CommandeID:number){
    return this._http.delete<any>(this.apiUrl+'/achat/cmd/cmd/'+CommandeID).toPromise();
  }

  restaurerCmd(CommandeID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/restaurer/'+CommandeID).toPromise();
  }
  
  addRec(reception){
    return this._http.post<any>(this.apiUrl+'/achat/cmd/nvreception',reception).toPromise();
  }

  getListeReception(CommandeID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/cmdreceptions/'+CommandeID).toPromise();
  }

  getReceptions(page:number,itemsPerPage:number,filter){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl + '/achat/cmd/receptionfilter' , body).toPromise();
  }

  getReception(CmdRecID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/reception/'+CmdRecID).toPromise();
  }

  ModifierReception(CmdRecID:number,arr,rapport){
    var body={'reception_det':arr,'rapport':rapport}
    return this._http.post<any>(this.apiUrl+'/achat/cmd/editreception/'+CmdRecID,body).toPromise();
  }

  getReceptionModifs(CmdRecID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/recmodifs/'+CmdRecID).toPromise();
  }

  getModif(CmdRecModifID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/modif/'+CmdRecModifID).toPromise();
  }

  AllModifs(){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/allmodifs').toPromise();
  }

  fermerCmd(CommandeID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/fermercmd/'+CommandeID).toPromise();
  }

  ouvrirCmd(CommandeID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/ouvrircmd/'+CommandeID).toPromise();
  }

  DroitRestaurationCmd(CommandeID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/droitrestaurationcmd/'+CommandeID).toPromise();
  }

  getFournisseurCmds(FournisseurID:number){
    return this._http.get<any>(this.apiUrl+'/achat/cmd/fournisseurcmds/'+FournisseurID).toPromise();
  }

  Imprimer(CmdIds){
    var body={CmdIds:CmdIds};
    return this._http.post<any>(this.apiUrl+'/achat/cmd/imprimer',body).toPromise();
  }

 

  /*
  filterReception(form){
    return this._http.post(environment.apiUrl + '/achat/cmd/receptionfilter' , form).toPromise();
  }
  */

  addBon(CmdRecID:number,body){
    return this._http.post<any>(environment.apiUrl + '/achat/cmd/addbon/'+CmdRecID,body).toPromise();
  }

  getBon(BonID:number){
    return this._http.get<any>(environment.apiUrl + '/achat/cmd/getbon/'+BonID).toPromise();
  }

  getBonByCmdRecID(CmdRecID:number){
    return this._http.get<any>(environment.apiUrl + '/achat/cmd/getbonbycmdrecid/'+CmdRecID).toPromise();
  }

  suprimerBon(BonID:number){
    return this._http.get<any>(environment.apiUrl + '/achat/cmd/suprimerBon/'+BonID).toPromise();
  }

  getBons(corbeille:number){
    return this._http.get<any>(environment.apiUrl + '/achat/cmd/bons/'+corbeille).toPromise();
  }

  filterBons(page:number,itemsPerPage:number,filter,corbielle:number){
    var body={page:page,itemsPerPage:itemsPerPage,filter:filter};
    return this._http.post<any>(environment.apiUrl + '/achat/cmd/filterbons/'+corbielle , body).toPromise();
  }

 


  ImprimerCmdFilter(form,FournisseurID:number){
    return this._http.post(environment.apiUrl + '/achat/cmd/imprimercmdfilter/'+FournisseurID , form).toPromise();
  }
  


  
}
