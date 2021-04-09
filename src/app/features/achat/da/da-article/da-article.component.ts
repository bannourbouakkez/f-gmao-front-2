import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DaService } from '../services/da.service';
import { ArticleService } from '../../../magasin/services/article.service';
import { NgForm , FormControl} from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil,mergeMap} from 'rxjs/operators';
import { NzInputNumberComponent } from 'ng-zorro-antd';
import { MessageService } from 'src/app/@pages/components/message/message.service';


@Component({
  selector: 'app-da-article',
  templateUrl: './da-article.component.html',
  styleUrls: ['./da-article.component.scss']
})
export class DaArticleComponent implements OnInit {
  //@ViewChild('qte',{static:true}) searchElement: ElementRef;
  @ViewChild(NzInputNumberComponent,{static:true}) searchElement;

  
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
  protected banks=<any>[] ;
  public ArticleID: FormControl = new FormControl();
  public bankServerSideFilteringCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public  filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
 */

  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<DaArticleComponent>,
  private _articleService: ArticleService,
  private _daService: DaService,private _notification: MessageService) { }

  ngOnInit() {

      //this._articleService.getArticleList().then(res => { this.articleList = res ; } );
      
      //+++ 32 ArticleID
      // +++ 33 des
      if (this.data.DaArticleIndex == null){
        this.formData = {
          DaArticleID: null,
          DaID: this.data.id,
          des: '',
          ArticleID: 0,
          qte: '',
          unite: '',
          motif:''
        }

      }
      else {
        this.formData = Object.assign({}, this._daService.daarticles[this.data.DaArticleIndex]);
        //console.log(JSON.stringify(this._daService.daarticles[this.data.DaArticleIndex]));
        this.formData.ArticleID=this._daService.daarticles[this.data.DaArticleIndex].ArticleID; // +++ ArticleID // +++ ArticleID
        
      }
      
      
      /*
      this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),tap(() => this.searching = true),takeUntil(this._onDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.banks) {
            return [];
          } 
         // return this.singleDbService.getFournisseurs(search);

         return this._articleService.getArticleListSearch(search);
         //return [];
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

      validateForm(formData) {
        this.isValid = true;
        if (formData.ArticleID == 0) // +++ ArticleID
          this.isValid = false;
        else if (formData.qte == 0 || isNaN(Number(formData.qte)) )
        this.isValid = false;
        else if (formData.unite == '' )
        { this.isValid = false; console.log('formData.unite'); }

        return this.isValid;
      }


      onSubmit(form: NgForm) {
        if (this.validateForm(form.value)) {
          if (this.data.DaArticleIndex == null){ 

             //this._daService.daarticles.push(form.value);

            
            if(!this.isArticleExistInBsmarticles(form.value.ArticleID)){ // article_id
              this._daService.daarticles.push(form.value);
            }else{
              this.notification('danger', "Article Exist Déja.", 2000);
            }
            

            }
          else{ this._daService.daarticles[this.data.DaArticleIndex] = form.value; }
          this.dialogRef.close('again');
          } 
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

      isArticleExistInBsmarticles(ArticleID:number){
        let exist=false;
        let arr=this._daService.daarticles;
        for(let i=0;i<arr.length;i++){
          let article_id=arr[i].ArticleID; // article_id
          if(ArticleID==article_id){exist=true;}
        }
        return exist;
      }

      updateNameAndUnite(ctrl) {
         ctrl = +ctrl;
         this.focus();


        if (ctrl == 0) {
          this.formData.des = ''; // +++ des
          this.formData.unite = '';
        }
        else {
          this.formData.des = this.articleList.find(x => x.ArticleID == ctrl).des; // +++ des
          this.formData.unite = this.articleList.find(x => x.ArticleID == ctrl).unite;
        }
      }

      
      focus(){
        //setTimeout(()=>{this.searchElement.nativeElement.focus();},20);
        this.searchElement.focus();
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




  }