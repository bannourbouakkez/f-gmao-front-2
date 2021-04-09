import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm , FormControl} from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil,mergeMap} from 'rxjs/operators';
import { BsooService } from '../../services/bsoo.service';
import { NzInputNumberComponent, NzSelectComponent } from 'ng-zorro-antd';
import { MessageService } from 'src/app/@pages/components/message/message.service';


@Component({
  selector: 'app-corr-bso-outils',
  templateUrl: './corr-bso-outils.component.html',
  styleUrls: ['./corr-bso-outils.component.scss']
})
export class CorrBsoOutilsComponent implements OnInit {

  //@ViewChild('estimation',{static:true}) searchElement: ElementRef;
  @ViewChild(NzInputNumberComponent,{static:true}) searchElement;
 /*
  @ViewChild(NzSelectComponent,{static:true}) searchElement2;
  ngAfterViewInit() {
    setTimeout(() => {
        //this.parent.name = 'updated name';
        //this.searchElement2.focus();
        //(this.searchElement2 as HTMLInputElement).focus();
      // this.searchElement2.

    
    },1000);

    window.onload = function(){
      var button = document.getElementById('searchElement2');
      setInterval(function(){
          button.click();
      },1000);  // this will make it click again every 1000 miliseconds
  };

}

 */ 
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
        this.bsoService.getOutilsBySearchWord(value).then(
        data=>{
        console.log(data);
        this.articleList = data;
        this.isLoading=false;
      });
    }
  }
  //####################################
  /*
  protected banks=<any>[];
  public outil_id: FormControl = new FormControl();
  public bankServerSideFilteringCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public  filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  */

  constructor(@Inject(MAT_DIALOG_DATA) public data,
  public dialogRef: MatDialogRef<CorrBsoOutilsComponent>,
  private bsoService: BsooService,private _notification: MessageService) { }
  
  ngOnInit() {

      //this._articleService.getArticleList().then(res => { this.articleList = res ; } );
      
      //+++ 32 article_id
      // +++ 33 des

      if (this.data.BsoArticleIndex == null){

        this.formData = {

          BsoDetID: null,
          bso_id: this.data.BsoID,
          des: '',
          estimation:'',
          periode:'heure',
          outil_id: 0,
          reserve:null

        }

      }else{

        this.formData = Object.assign({}, this.bsoService.bsoarticles[this.data.BsoArticleIndex]);
        this.formData.outil_id=this.bsoService.bsoarticles[this.data.BsoArticleIndex].outil_id; 

      }
      
      //this.searchElement2.focus();

      
      /*
      this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),tap(() => this.searching = true),takeUntil(this._onDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.banks) {
            return [];
          } 
         return this.bsoService.getOutilsBySearchWord(search);
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

        if (this.validateForm(form.value) ) {
          if (this.data.BsoArticleIndex == null){
              
            if(!this.isOutilExistInBsoarticles(form.value.outil_id)){
              this.bsoService.bsoarticles.push(form.value); 
            }else{
              //console.log('exist deja');
              this.notification('danger', "Outil Exist Déja.", 2000);
            }

          }
          else{ this.bsoService.bsoarticles[this.data.BsoArticleIndex] = form.value; }
           this.dialogRef.close('again');
          } 
      }

      isOutilExistInBsoarticles(OutilID:number){
        let exist=false;
        let arr=this.bsoService.bsoarticles;
        for(let i=0;i<arr.length;i++){
          let outil_id=arr[i].outil_id;
          if(OutilID==outil_id){exist=true;}
        }
        return exist;
      }


      updateNameAndUnite(ctrl) {
         ctrl = +ctrl;
         this.focus();
        if (ctrl == 0) {
          this.formData.des = ''; 
          this.formData.reserve = '';
        }else {
          this.formData.des = this.articleList.find(x => x.OutilID == ctrl).des; 
          this.formData.reserve = this.articleList.find(x => x.OutilID == ctrl).reserve; 
          console.log();
        }
      }
      
      validateForm(formData) {
        //console.log(formData);
        this.isValid = true;
        if (formData.outil_id == 0)  { this.isValid = false; } 
        else if ( this.formData.reserve==1 &&  this.data.Use=='Use')
        { this.isValid = false; console.log('formData.reserve'); }
        return this.isValid;
      }

      focus(){
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