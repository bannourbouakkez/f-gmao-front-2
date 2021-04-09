import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from '../../../magasin/services/article.service';
import { NgForm , FormControl} from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil,mergeMap} from 'rxjs/operators';
import { BsmService } from '../../services/bsm.service';
import { NzInputNumberComponent } from 'ng-zorro-antd';
import { MessageService } from 'src/app/@pages/components/message/message.service';


@Component({
  selector: 'app-corr-bsm-articles',
  templateUrl: './corr-bsm-articles.component.html',
  styleUrls: ['./corr-bsm-articles.component.scss']
})
export class CorrBsmArticlesComponent implements OnInit {

  //@ViewChild('qte',{static:true}) searchElement: ElementRef;
  @ViewChild(NzInputNumberComponent,{static:true}) searchElement;
  //NzInputNumberComponent
  
  formData;
  articleList=<any>[];
  isValid: boolean = true;
  
  //--------------- nouveau dynamic ----
  selectedValue = null;
  nzFilterOption = () => true;
  isLoading=false;
  search(value: string): void {
   if(value){
    this.isLoading=true;
        this._articleService.getArticleListSearch(value).then(
        data=>{
        console.log(data);
        this.articleList = data;
        this.isLoading=false;
      });
    }
  }
  //####################################
  
  /*
  public article_id: FormControl = new FormControl();
  protected banks=<any>[];
  public bankServerSideFilteringCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public  filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  */

  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<CorrBsmArticlesComponent>,
  private _articleService: ArticleService,
  private bsmService: BsmService,private _notification: MessageService) { }
  
  ngOnInit() {


      //this._articleService.getArticleList().then(res => { this.articleList = res ; } );
      
      //+++ 32 article_id
      // +++ 33 des

      if (this.data.BsmArticleIndex == null){

        this.formData = {

          BsmDetID: null,
          bsm_id: this.data.BsmID,
          des: '',
          article_id: 0,
          qte: '',
          unite: '',
          motif:'',
          stock:''
          
        }

      }else{
        this.formData = Object.assign({}, this.bsmService.bsmarticles[this.data.BsmArticleIndex]);
        this.formData.article_id=this.bsmService.bsmarticles[this.data.BsmArticleIndex].article_id; 
      }
      
      
      /*
      this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),tap(() => this.searching = true),takeUntil(this._onDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.banks) {
            return [];
          } 
         return this._articleService.getArticleListSearch(search);
        }),
        tap((articles:any[]) =>{
          this.articleList=articles;
        }),
        delay(500))
      .subscribe(filteredBanks => {
        this.searching = false; this.filteredServerSideBanks.next(filteredBanks);
      },error => {this.searching = false; });
      */

      }

   


      onSubmit(form: NgForm) {
        if (this.validateForm(form.value)) {

          if (this.data.BsmArticleIndex == null){ 

            console.log(form.value);
            console.log(this.bsmService.bsmarticles);

            
            if(!this.isArticleExistInBsmarticles(form.value.article_id)){
              this.bsmService.bsmarticles.push(form.value);
            }else{
              //console.log('exist deja');
              this.notification('danger', "Article Exist Déja.", 2000);
            }
            
            

             }
          else{ this.bsmService.bsmarticles[this.data.BsmArticleIndex] = form.value; }
           this.dialogRef.close('again');
          } 
      }


      isArticleExistInBsmarticles(ArticleID:number){
        let exist=false;
        let arr=this.bsmService.bsmarticles;
        for(let i=0;i<arr.length;i++){
          let article_id=arr[i].article_id;
          if(ArticleID==article_id){exist=true;}
        }
        return exist;
      }

      updateNameAndUnite(ctrl) {
         ctrl = +ctrl;
         this.focus();
        if (ctrl == 0) {
          this.formData.des = ''; 
          this.formData.unite = '';
          this.formData.stock = '';
        }else {
          this.formData.des = this.articleList.find(x => x.ArticleID == ctrl).des; 
          this.formData.unite = this.articleList.find(x => x.ArticleID == ctrl).unite;
          this.formData.stock = this.articleList.find(x => x.ArticleID == ctrl).stock;

        }
      }

      validateForm(formData) {
        this.isValid = true;
        if (formData.article_id == 0) 
          this.isValid = false;
        else if (formData.qte == 0 || isNaN(Number(formData.qte)) )
        this.isValid = false;
        else if (formData.unite == '' )
        { this.isValid = false; console.log('formData.unite'); }
        else if ( this.data.Reservation !='reservation' && (formData.qte > formData.stock)  )
        { this.isValid = false; console.log('formData.stock'); }
        return this.isValid;
      }

      focus(){
        //console.log('focus');
        this.searchElement.focus();
        //setTimeout(()=>{this.searchElement.nativeElement.focus();},20);
      }

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


      
  notification(type: string, msg: string, duree: number) {
    // type : primary , success , danger 
    this._notification.create(
      type,
      msg,
      {
        Position: "top-right",
        Style: "simple",
        Duration: duree
      }
    );
  }


  }