import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from '../../../../magasin/services/article.service';
import { NgForm , FormControl} from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil,mergeMap} from 'rxjs/operators';
import { AddArticlesService } from '../add-articles.service';


@Component({
  selector: 'app-add-articles-comp',
  templateUrl: './add-articles-comp.component.html',
  styleUrls: ['./add-articles-comp.component.scss']
})
export class AddArticlesCompComponent implements OnInit {

  //@ViewChild('qte',{static:true}) searchElement: ElementRef;
  
  formData;
  articleList=<any>[];
  isValid: boolean = true;
  
  protected banks=<any>[];
  public article_id: FormControl = new FormControl();
  public bankServerSideFilteringCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public  filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<AddArticlesCompComponent>,
  private _articleService: ArticleService,
  private addArticle: AddArticlesService) { }
  
  ngOnInit() {
      if (this.data.ArticleIndex == null){
        this.formData = {
          EquipementArticleID: null,
          equipement_id: this.data.EquipementID,
          article_id: 0,
          des: ''
        }
      }else{

        if(this.data.type=='magasin'){
        this.formData = Object.assign({}, this.addArticle.articlesMagasin[this.data.ArticleIndex]);
        this.formData.article_id=this.addArticle.articlesMagasin[this.data.ArticleIndex].article_id; 
        }
        if(this.data.type=='atelier'){
        this.formData = Object.assign({}, this.addArticle.articlesAtelier[this.data.ArticleIndex]);
        this.formData.article_id=this.addArticle.articlesAtelier[this.data.ArticleIndex].article_id; 
        }
      }
      
      
      this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),tap(() => this.searching = true),takeUntil(this._onDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.banks) {
            return [];
          }
          if(this.data.type=='magasin'){return this._articleService.getArticleListSearch(search);}
          if(this.data.type=='atelier'){return this._articleService.getArticleAtelierListSearch(search);}
        }),
        tap((articles:any[]) =>{
          this.articleList=articles;
        }),
        delay(500))
      .subscribe(filteredBanks => {
        this.searching = false; this.filteredServerSideBanks.next(filteredBanks);
      },error => {this.searching = false; });


      }
      
      onSubmit(form: NgForm) {
        if (this.validateForm(form.value)) {
        //if (true) {

          if (this.data.ArticleIndex == null){

              if(this.data.type=='magasin'){
                if(!this.isArticleExistInArticlesMagasin(form.value.article_id)){
                this.addArticle.articlesMagasin.push(form.value);
                }else{console.log('exist deja'); }
              }
              if(this.data.type=='atelier'){
                if(!this.isArticleExistInArticlesAtelier(form.value.article_id)){
                this.addArticle.articlesAtelier.push(form.value);
                }else{ console.log('exist deja'); }
              }

          }else{
            if(this.data.type=='magasin'){
             this.addArticle.articlesMagasin[this.data.ArticleIndex] = form.value; 
            }
            if(this.data.type=='atelier'){
              this.addArticle.articlesAtelier[this.data.ArticleIndex] = form.value; 
            }
          }

          this.dialogRef.close();
          
        } 
      }


      isArticleExistInArticlesMagasin(ArticleID:number){
        let exist=false;
        let arr=this.addArticle.articlesMagasin;
        for(let i=0;i<arr.length;i++){
          let article_id=arr[i].article_id;
          if(ArticleID==article_id){exist=true;}
        }
        return exist;
      }

      isArticleExistInArticlesAtelier(ArticleID:number){
        let exist=false;
        let arr=this.addArticle.articlesAtelier;
        for(let i=0;i<arr.length;i++){
          let article_id=arr[i].article_id;
          if(ArticleID==article_id){exist=true;}
        }
        return exist;
      }


      updateNameAndUnite(ctrl) {
         ctrl = +ctrl;
         //this.focus();
        if (ctrl == 0) {
          this.formData.des = ''; 
        }else {
          this.formData.des = this.articleList.find(x => x.ArticleID == ctrl).des; 
        }
      }

      validateForm(formData) {
        this.isValid = true;
        if (formData.article_id == 0) 
          this.isValid = false;
        /*
        else if (formData.qte == 0 || isNaN(Number(formData.qte)) )
        this.isValid = false;
        else if (formData.unite == '' )
        { this.isValid = false; console.log('formData.unite'); }
        else if (formData.qte > formData.stock  )
        { this.isValid = false; console.log('formData.stock'); }
        */
        return this.isValid;
      }
/*
      focus(){
        setTimeout(()=>{this.searchElement.nativeElement.focus();},20);
      }
*/
      public OnlyNumbers($event) {
        let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
        let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
        //enter code here
        if (specialKeys.indexOf($event.key) !== -1) { return; }
        else { if (regex.test($event.key)) { return true; } else { return false; } }
      }

  

      ngxMatSelectChange(e){
        console.log(e)
      }




  }