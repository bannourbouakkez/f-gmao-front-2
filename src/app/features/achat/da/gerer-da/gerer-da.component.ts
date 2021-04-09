import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../magasin/services/article.service';
import { FormControl, NgForm } from '@angular/forms';

//class Model {ArticleID: number ; Value: number;};

@Component({
  selector: 'app-gerer-da',
  templateUrl: './gerer-da.component.html',
  styleUrls: ['./gerer-da.component.scss']
  //providers: [Model]
})
export class GererDaComponent implements OnInit {
  type:Array<{ArticleID: number, Value: number}>;
  articles=[];
  valeurs:Array<{ArticleID: number, Value: number}>=[];
  constructor(private _articleService:ArticleService
    //,private model: Model
    ) {}


  ngOnInit() {
     
  }

  selectChange(e){
    console.log(e.value);
    this._articleService.getArticleListSearch(e.value).then(
      res=>{
      this.articles=res as [] ;

      for (let i = 0; i < this.articles.length; i++) { 
        this.articles[i]['formControl'] = new FormControl('');
      }

      },
      err=>console.log(err)
    );
  }

  submit(form:NgForm){
    //console.log(this.articles);
    this.newArray();
    console.log(this.valeurs);
    console.log(this.valeurs[0].ArticleID);
  }

  newArray(){
  for (let i = 0; i < this.articles.length; i++) { 
    let obj = { ArticleID:this.articles[i].ArticleID, Value:this.articles[i].formControl.value};
  
    /*
    let ojb2=this.model;
    ojb2.ArticleID=this.articles[i].ArticleID;
    ojb2.Value=this.articles[i].formControl.value;
    this.valeurs.push(ojb2);
    */

    this.valeurs.push(obj);
  }
  }


}



