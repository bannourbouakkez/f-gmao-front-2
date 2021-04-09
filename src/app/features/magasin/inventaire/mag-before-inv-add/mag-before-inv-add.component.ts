import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { InventaireService } from '../../services/inventaire.service';
import { FormControl, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OutilService } from '../../services/outil.service';

@Component({
  selector: 'app-mag-before-inv-add',
  templateUrl: './mag-before-inv-add.component.html',
  styleUrls: ['./mag-before-inv-add.component.scss']
})
export class MagBeforeInvAddComponent implements OnInit {

  Form:FormGroup;
  familles=<any>[];
  sousfamilles=<any>[];
  articles=<any>[];
  ListeValueIntervenants=[];
  intervenants=<any>[];

  constructor(private articleService:ArticleService,private inventaireService:InventaireService,
              private _router: Router,private _fb:FormBuilder,private outilService:OutilService) { }

  ngOnInit() {
    this.FormInit();
    this.outilService.getUseAndTables(0,'ajouter').then(
      res=>{this.intervenants=res.intervenants;
      console.log(this.intervenants)},
      err=>console.log(err)
    );
    this.getFamilles();
  }

  FormInit(){
   this.Form=this._fb.group({
     famille_id:['',Validators.required],
     sous_famille_id:['',Validators.required],
     type_inventaire:['',Validators.required]
   });
  }

  SelectFamille(e) { 
    this.sousfamilles=[];
    if(e>0){ this.getListeSousFamilles(e); }
  }

  Selectsous_famille_id(e) {
    this.getArticlesHasSFamID(e);
  }
  
  getArticlesHasSFamID(e:number){
    this.inventaireService.getArticlesHasSFamID(e).then(
      res=>{
        this.articles=res;
        for (let i = 0; i < this.articles.length; i++) {  this.articles[i]['formControl'] = new FormControl(false);}
      },
      err=>console.log(err)
    );
  }

  getListeSousFamilles(e:number) {
    this.articleService.getListeSousFamilles(e).then(
      res=>{this.sousfamilles=res;},
      err=>console.log(err)
    );
  }

  getFamilles() {
    this.articleService.getFamilles().then(
      res=>{this.familles=res;},
      err=>console.log(err)
    );
  }

  
  
  inventaireArtIDs(artIDsForm:NgForm){
    let ArtIDs=<any>[];
    for (var i = 0;  i<this.articles.length; i++ ) {
    //  console.log(this.articles[i]);
      if(this.articles[i].formControl.value == true){
        ArtIDs.push(this.articles[i].ArticleID);
      }
    }
    
    if(this.Form.valid){
// let params = {q: 'value', array: ['v1','v2']};
let params = {type:this.Form.controls['type_inventaire'].value,intervenants:this.ListeValueIntervenants,array:ArtIDs};
// this._router.navigate(['/magasin/inv/add'],{ queryParams: { array:ArtIDs }});
 this._router.navigate(['/magasin/inv/add'],{ queryParams:params});
    }else{
      console.log('non valid');
    }

  /*
    this.inventaireService.inventaireArtIDs(ArtIDs).then(
      res=>{
      console.log(res);
      this.openDialog(res);
      },
      err=>console.log('ImprimerCmdComponent:Imprimer:',err)
    );
    */

  }

  
  ReceptListeValueIntervenantsEmitted(e){
    this.ListeValueIntervenants=e;
  }





}
