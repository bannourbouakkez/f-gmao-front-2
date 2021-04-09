import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventaireService } from '../../services/inventaire.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mag-inv-add',
  templateUrl: './mag-inv-add.component.html',
  styleUrls: ['./mag-inv-add.component.scss']
})
export class MagInvAddComponent implements OnInit {

   ArtIDs=<any>[];
   IntervenantsIDs=<any>[];
   type:string;
   sub;
   articles=<any>[];
   intervenants=<any>[];
   NameButtonEnvoyer:string="";
  constructor(private _currentRoute: ActivatedRoute,private inventaireService:InventaireService) { }

  ngOnInit() {
    //this.ArtIDs = +this._currentRoute.snapshot.paramMap.get('array');
    //console.log(this.ArtIDs[0]);
    
    
    this.sub = this._currentRoute
      .queryParams
      .subscribe(params => {
        this.type = params['type'];

        this.ArtIDs = params['array'] ;
        this.ArtIDs=this.arrayStringToArrayNumber(this.ArtIDs);
        this.IntervenantsIDs = params['intervenants'] ;
        this.IntervenantsIDs=this.arrayStringToArrayNumber(this.IntervenantsIDs);
        this.getArticlesByArtIDs(this.ArtIDs);
        this.getIntervenantsByIntervenantsIDs(this.IntervenantsIDs);
       if(this.type=='enregistrement'){this.NameButtonEnvoyer="Enregistrement"}
       if(this.type=='correction'){this.NameButtonEnvoyer="Enregistrement & Correction"}
      });
  }

  arrayStringToArrayNumber(ArtIDs){
    let arrIDs=<any>[];
    for (let i = 0; i < ArtIDs.length; i++) {
      arrIDs[i]=+ ArtIDs[i];
    }
    return arrIDs;
  }

  
  getArticlesByArtIDs(ArtIDs){
   this.inventaireService.getArticlesByArtIDs(ArtIDs).then(
    res=>{
      let array=<any>[];
      array=res;
      this.articles=this.addControlFormToArray(array);
    },
    err=>console.log(err)
   );
  }

  getIntervenantsByIntervenantsIDs(InterIDs){
    this.inventaireService.getIntervenantsByIntervenantsIDs(InterIDs).then(
     res=>{this.intervenants=res;},
     err=>console.log(err)
    );
   }

  addControlFormToArray(arr){
    for (let i = 0; i < arr.length; i++) {
      arr[i]['formControl'] = new FormControl('');
    }
    return arr;
  }
  
  inventaire(){
    let arr=this.NewArr(); 
    this.inventaireService.inventaire(arr,this.IntervenantsIDs,this.type).then(
      res=>console.log(res),
      err=>console.log(err)
    );
  }


  NewArr(){
    let arr=<any>[];
    for (let i = 0; i < this.articles.length; i++) {
      let object:any;
      let value = this.articles[i]['formControl'].value;
      let ArticleID=this.articles[i].ArticleID;
      object = {ArticleID:ArticleID,value:value}
      arr.push(object);
    }
    return arr;
  }

}
