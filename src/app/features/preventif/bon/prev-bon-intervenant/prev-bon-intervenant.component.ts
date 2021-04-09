import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgForm, FormControl } from '@angular/forms';

import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, tap, filter, map, takeUntil, mergeMap } from 'rxjs/operators';
import moment from 'moment';
import { PrevBonpService } from '../../services/prev-bonp.service';
import { CorrBonService } from 'src/app/features/correctif/services/corr-bon.service';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { EquipementService } from 'src/app/features/equipement/services/equipement.service';
import { EquiTacheAddComponent } from 'src/app/features/equipement/tache/equi-tache-add/equi-tache-add.component';

@Component({
  selector: 'app-prev-bon-intervenant',
  templateUrl: './prev-bon-intervenant.component.html',
  styleUrls: ['./prev-bon-intervenant.component.scss']
})
export class PrevBonIntervenantComponent implements OnInit {


  @ViewChild('date1', { static: true }) date1: ElementRef;
  @ViewChild('time1', { static: true }) time1: ElementRef;
  @ViewChild('date2', { static: true }) date2: ElementRef;
  @ViewChild('time2', { static: true }) time2: ElementRef;
  @ViewChild('description', { static: true }) description: ElementRef;

  date = new Date();
  formData;
  intervenantList = <any>[];
  tacheList = <any>[];
  isValid: boolean = true;

  idFormDataChanged=false;
  formDataValidity=false;
  errorMsgs=<any>[];

   //--------------- nouveau dynamic ----
   selectedValue = null;
   nzFilterOption = () => true;
   isLoading=false;
   search(value: string): void {
     if(value){
     this.isLoading=true;
     this.vraicorrBonService.getIntervenantsBySearchWord(value).then(
         data=>{
         console.log(data);
         this.intervenantList = data;
         this.isLoading=false;
       });
      }
   }
   //####################################
 
   //--------------- nouveau dynamic ----
   selectedValue2 = null;
   nzFilterOption2 = () => true;
   isLoading2=false;
   search2(value: string): void {
     //if(value){
     this.isLoading2=true;
      //this.vraicorrBonService.getTachesBySearchWord(value).then(
      this.vraicorrBonService.getTachesBySearchWordByEquipementID(value,this.data.EquipementIDForTaches).then(
         data=>{
         console.log(data);
         this.tacheList = data;
         this.isLoading=false;
       });
      //}
   }
   //####################################


  /*
  protected banks = <any>[];
  //public IntervenantID: FormControl = new FormControl();
  public bankServerSideFilteringCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  protected taches = <any>[];
  //public IntervenantID: FormControl = new FormControl();
  public tacheServerSideFilteringCtrl: FormControl = new FormControl();
  public tachesearching: boolean = false;
  public filteredServerSideTaches: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _tacheonDestroy = new Subject<void>();
  */


  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<PrevBonIntervenantComponent>,
    private corrBonService: PrevBonpService,private vraicorrBonService:CorrBonService,private _notification: MessageService
    ,private matDialog: MatDialog,private equipementService:EquipementService) { }

  ngOnInit() {
    if (this.data.BonID == 0) { this.data.BonID = null; }
    if (this.data.BonIntervenantIndex == null) {

      this.formData = {
        BonpIntervenantID: null,
        bon_id: this.data.BonID,
        intervenant_id: null,
        name: null,
        date1: this.data.DateTimeOT,
        time1: null,//this.data.DateTimeOT,
        date2: this.data.DateTimeOT,
        time2: null,
        tache_id: null,
        tache: null,
        description: null
      }

    } else {
      this.formData = Object.assign({}, this.corrBonService.bonpintervenants[this.data.BonIntervenantIndex]);
    }

    this.search2('');

/*
    this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search), tap(() => this.searching = true), takeUntil(this._onDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.banks) {
            return [];
          }
          return this.vraicorrBonService.getIntervenantsBySearchWord(search);
        }),
        tap((articles: any[]) => {
          this.intervenantList = articles;
        }),
        delay(500))
      .subscribe(filteredBanks => {
        this.searching = false; this.filteredServerSideBanks.next(filteredBanks);
      }, error => { this.searching = false; });


    this.tacheServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search), tap(() => this.tachesearching = true), takeUntil(this._tacheonDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.taches) {
            return [];
          }
          return this.vraicorrBonService.getTachesBySearchWord(search);
        }),
        tap((articles: any[]) => {
          this.tacheList = articles;
        }),
        delay(500))
      .subscribe(filteredTaches => {
        this.tachesearching = false; this.filteredServerSideBanks.next(filteredTaches);
      }, error => { this.tachesearching = false; });
*/


  }




  onSubmit(form: NgForm) {

    var success = true;
    if (this.isFull(form)) {
      if (this.TesterTimeMinTimeMax(form.value.date1, form.value.time1, form.value.date2, form.value.time2)) {

        if (this.TesterMemeIntervenantMemeTacheTempsCommune(form.value.BonpIntervenantID, form.value.intervenant_id, form.value.tache_id, form.value.date1, form.value.time1, form.value.date2, form.value.time2)) {
          if (this.data.BonIntervenantIndex == null) {
            this.corrBonService.bonpintervenants.push(form.value);
          } else {
            this.corrBonService.bonpintervenants[this.data.BonIntervenantIndex] = form.value;
          }
        } else {
          success = false;
         // console.log('famma 7aja commune');
          this.notification('danger', "famma 7aja commune", 4000);

        }
      } else {
        success = false;
        //console.log(' min akber mel max');
        this.notification('danger', "min akber mel max", 3000);

      }
    } else {
      success = false;
     // console.log('formulaire na9is');
      this.notification('danger', "formulaire na9is", 3000);

    }

    if (success) {
      this.dialogRef.close('again');
    }


    /*
    if (this.validateForm(form.value) ) {
      if (this.data.BsoArticleIndex == null){
          
        if(!this.isOutilExistInBsoarticles(form.value.outil_id)){
          this.bsoService.bsoarticles.push(form.value); 
        }else{
          console.log('exist deja');
        }

      }
      else{ this.bsoService.bsoarticles[this.data.BsoArticleIndex] = form.value; }
       this.dialogRef.close('again');
      } 
    */

  }

  /*
  isOutilExistInBsoarticles(OutilID:number){
    let exist=false;
    let arr=this.bsoService.bsoarticles;
    for(let i=0;i<arr.length;i++){
      let outil_id=arr[i].outil_id;
      if(OutilID==outil_id){exist=true;}
    }
    return exist;
  }
  */

  
 formDataDatesTimesChangedFunc(){
  this.idFormDataChanged=true;
  this.CheckIfFormDataValid();
 }
 CheckIfFormDataValid(){
  if (
  this.isFullFormData() 
  && this.TesterTimeMinTimeMax(this.formData.date1, this.formData.time1, this.formData.date2, this.formData.time2)
  && this.TesterMemeIntervenantMemeTacheTempsCommune(this.formData.ReservationIntervenantID,this.formData.intervenant_id,this.formData.tache_id,this.formData.date1,this.formData.time1,this.formData.date2,this.formData.time2)
  ) {
    this.formDataValidity=true;
    this.errorMsgs=[];
  }else{
    this.formDataValidity=false;
    this.errorMsgs=[];

    if(!this.isFullFormData()){  this.errorMsgs.push('formulaire na9is'); }
    if(!this.TesterTimeMinTimeMax(this.formData.date1, this.formData.time1, this.formData.date2, this.formData.time2)){  this.errorMsgs.push('min akber mel max'); }
    if(!this.TesterMemeIntervenantMemeTacheTempsCommune(this.formData.ReservationIntervenantID,this.formData.intervenant_id,this.formData.tache_id,this.formData.date1,this.formData.time1,this.formData.date2,this.formData.time2)){  this.errorMsgs.push('famma 7aja commune'); }
  }
 }
 isFullFormData(){
  if(this.isNOrU(this.formData.date1) || this.isNOrU(this.formData.time1) || this.isNOrU(this.formData.date2) || this.isNOrU(this.formData.time2)
  || this.isNOrU(this.formData.intervenant_id) 
  || this.isNOrU(this.formData.tache_id) 
  ) { return false; }
  return true;
}


  
  updateName(ctrl) {
    
    
    ctrl = +ctrl;
    setTimeout(() => { this.time2.nativeElement.focus(); }, 20);
    if (ctrl == 0) {
      this.formData.name = '';
      //this.formData.reserve = '';
    } else {
      this.formData.name = this.intervenantList.find(x => x.IntervenantID == ctrl).name;
      //this.formData.reserve = this.articleList.find(x => x.OutilID == ctrl).reserve; 
      // console.log();
    }
    this.formDataDatesTimesChangedFunc();
  }

  updateTache(ctrl) {
    //this.CheckIfFormDataValid();
    ctrl = +ctrl;
    setTimeout(() => { this.description.nativeElement.focus(); }, 20);
    if (ctrl == 0) {
      this.formData.tache = '';
    } else {
      //console.log(ctrl);
      //console.log(this.tacheList);
      this.formData.tache = this.tacheList.find(x => x.TacheID == ctrl).tache;
      // this.formData.tache_id = this.tacheList.find(x => x.TacheID == ctrl).TacheID; 
      
    }
    this.formDataDatesTimesChangedFunc();
  }


  validateForm(formData) {
    //console.log(formData);
    this.isValid = true;
    if (formData.outil_id == 0) { this.isValid = false; }
    else if (this.formData.reserve == 1 && this.data.Use == 'Use') { this.isValid = false; console.log('formData.reserve'); }
    return this.isValid;
  }

  focus() {
    setTimeout(() => { this.date2.nativeElement.focus(); }, 20);
  }

  public OnlyNumbers($event) {
    let regex: RegExp = new RegExp(/^[0-9]{1,}$/g);
    let specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowRight', 'ArrowLeft'];
    //enter code here
    if (specialKeys.indexOf($event.key) !== -1) { return; }
    else { if (regex.test($event.key)) { return true; } else { return false; } }
  }



  ngxMatSelectChange(e) {
    console.log(e)
  }

  isFull(form:NgForm){
     if(this.isNOrU(form.value.date1) || this.isNOrU(form.value.time1) || this.isNOrU(form.value.date2) || this.isNOrU(form.value.time2)
     || this.isNOrU(form.value.intervenant_id)
     || this.isNOrU(form.value.tache_id) 
      ) { return false; }
     return true;
  }

  isNOrU(obj:any){
   if(obj==null || obj==undefined){return true;}
   return false;
  }

  TesterTimeMinTimeMax(date1: Date, time1: Date, date2: Date, time2: Date) {

    //console.log('1:time1:'+time1);
    //console.log('1:time2:'+time2.format('YYYY-MM-DD HH:mm'));
    //date1=new Date(date1); //date1=this.ReglageDate(date1);
    //time1=new Date(time1); //time1=this.ReglageDate(time1);
    //date2=new Date(date2); //date2=this.ReglageDate(date2);
    //time2=new Date(time2); //time2=this.ReglageDate(time2);

    //date1=new Date(date1); date1=this.ReglageDate(date1);
    //time1=new Date(time1); time1=this.ReglageDate(time1);
    //date2=new Date(date2); date2=this.ReglageDate(date2);
    //time2=new Date(time2); time2=this.ReglageDate(time2);

    //date1=this.ReglageDate(date1);
    //time1=this.ReglageDate(time1);
    //date2=this.ReglageDate(date2);
    //time2=this.ReglageDate(time2);

    //date1=date1.format('YYYY-MM-DD HH:mm'); 
    //time1=time1.format('YYYY-MM-DD HH:mm');
    //date2=date2.format('YYYY-MM-DD HH:mm'); 
    //time2=time2.format('YYYY-MM-DD HH:mm');

    //time1=new Date(time1); //time1=this.ReglageDate(time1);
    //date2=new Date(date2); //date2=this.ReglageDate(date2);
    //time2=new Date(time2); //time2=this.ReglageDate(time2);

    // date1=new Date(date1); 
    // time1=new Date(time1); 
    //  date2=new Date(date2); 
    // time2=new Date(time2); 

    // 3ibara new Date béch n7awlou lel type date ama ma ghir timezone ma tod5il 7al béhi 
    // w ken n7ib time zone yod5il na3mil hikka 
    // date1=new Date(moment(date1).format("YYYY-MM-DDTHH:mm:00"))+ "Z";

    date1 = new Date(moment(date1).format("YYYY-MM-DDTHH:mm:00"));
    time1 = new Date(moment(time1).format("YYYY-MM-DDTHH:mm:00"));
    date2 = new Date(moment(date2).format("YYYY-MM-DDTHH:mm:00"));
    time2 = new Date(moment(time2).format("YYYY-MM-DDTHH:mm:00"));

    //console.log('2:time1:'+time1+','+date1);//-- 
    //console.log('2:time2:'+time2+','+date2);//-- 

    //let datetimemin=this.combineDateTimeUTC(date1,time1);
    //let datetimemax=this.combineDateTimeUTC(date2,time2);


    let datetimemin: Date = this.combineDateTime(date1, time1);
    let datetimemax: Date = this.combineDateTime(date2, time2);

    //console.log(typeof(datetimemin));


    //console.log('datetimemin:'+datetimemin);//--
    //console.log('datetimemax:'+datetimemax);//-- 

    //console.log('min: '+datetimemin+' , max: '+datetimemax);
    //console.log(datetimemin.getTime()+'<>'+datetimemax.getTime());
    console.log('diffirence : ' + (((datetimemax.getTime() - datetimemin.getTime()) / 1000) / 60) + ' min');

    if (datetimemin.getTime() < datetimemax.getTime()) { return true; }
    else { return false; }

  }

  TesterMemeIntervenantMemeTacheTempsCommune(BonpIntervenantID: number, intervenant_id: number, tache_id: number, date1, time1, date2, time2) {

    //date1=new Date(date1); //date1=this.ReglageDate(date1);
    //time1=new Date(time1); //time1=this.ReglageDate(time1);
    // date2=new Date(date2); //date2=this.ReglageDate(date2);
    // time2=new Date(time2); //time2=this.ReglageDate(time2);


    date1 = new Date(moment(date1).format("YYYY-MM-DDTHH:mm:00"));
    time1 = new Date(moment(time1).format("YYYY-MM-DDTHH:mm:00"));
    date2 = new Date(moment(date2).format("YYYY-MM-DDTHH:mm:00"));
    time2 = new Date(moment(time2).format("YYYY-MM-DDTHH:mm:00"));

    for (let i = 0; i < this.corrBonService.bonpintervenants.length; i++) {
      let _BonpIntervenantID = this.corrBonService.bonpintervenants[i].BonpIntervenantID;
      let _intervenant_id = this.corrBonService.bonpintervenants[i].intervenant_id;
      let _tache_id = this.corrBonService.bonpintervenants[i].tache_id;

      //let _date1=new Date(this.corrBonService.bonintervenants[i].date1);
      //let _time1=new Date(this.corrBonService.bonintervenants[i].time1);
      //let _date2=new Date(this.corrBonService.bonintervenants[i].date2);
      //let _time2=new Date(this.corrBonService.bonintervenants[i].time2);

      let _date1 = new Date(moment(this.corrBonService.bonpintervenants[i].date1).format("YYYY-MM-DDTHH:mm:00"));
      let _time1 = new Date(moment(this.corrBonService.bonpintervenants[i].time1).format("YYYY-MM-DDTHH:mm:00"));
      let _date2 = new Date(moment(this.corrBonService.bonpintervenants[i].date2).format("YYYY-MM-DDTHH:mm:00"));
      let _time2 = new Date(moment(this.corrBonService.bonpintervenants[i].time2).format("YYYY-MM-DDTHH:mm:00"));

      //console.log(BonpIntervenantID+'!='+_BonpIntervenantID);
      /*//++
      if(this.data.BonID){ 
  
      if(BonpIntervenantID==null || BonpIntervenantID==undefined){ // lo5rin mriglin // ajouter nouveau
  
        if((_intervenant_id==intervenant_id) && (_tache_id == tache_id)){
          console.log('1 : '+BonpIntervenantID+'!='+_BonpIntervenantID);
          let isTempsCommune = this.isTempsCommune(date1,time1,date2,time2,_date1,_time1,_date2,_time2);
          if(isTempsCommune){return false;}
        }
  
      }else{ // lo5rin mriglin // modifier wa7da kémla 
  
        if( (_intervenant_id==intervenant_id) && (_tache_id == tache_id) && (BonpIntervenantID!=_BonpIntervenantID)){
          console.log('2 : '+BonpIntervenantID+'!='+_BonpIntervenantID);
          let isTempsCommune = this.isTempsCommune(date1,time1,date2,time2,_date1,_time1,_date2,_time2);
          if(isTempsCommune){return false;}
        }
  
      }
    */
      //}else{ //++

      if (this.corrBonService.isDateTimeCompleted(i)) {

        if (this.data.BonIntervenantIndex == null) { // lo5rin (mriglin/méch mriglin) // ajouter nouveau

          if ((_intervenant_id == intervenant_id)) { // && (_tache_id == tache_id) ){
            console.log('[BonIntervenantIndex==null] comparaison avec i= : ' + i);
            let isTempsCommune = this.isTempsCommune(date1, time1, date2, time2, _date1, _time1, _date2, _time2);
            if (isTempsCommune) { return false; }
          }
        } else { // lo5rin (mriglin/mouch mriglin) // modifier wa7da (mrigla/mech mrigla)

          if ((_intervenant_id == intervenant_id) && (this.data.BonIntervenantIndex != i)) { // && (_tache_id == tache_id) ){
            console.log('[BonIntervenantIndex==' + this.data.BonIntervenantIndex + '] comparaison avec i= : ' + i);
            let isTempsCommune = this.isTempsCommune(date1, time1, date2, time2, _date1, _time1, _date2, _time2);
            if (isTempsCommune) { return false; }
          }

        }

      }


      //}//++



    }
    return true;

  }

  isTempsCommune(date1: Date, time1, date2: Date, time2: Date, _date1: Date, _time1, _date2: Date, _time2: Date) {

    let datetime1: Date = this.combineDateTime(date1, time1);
    let datetime2: Date = this.combineDateTime(date2, time2);
    let _datetime1: Date = this.combineDateTime(_date1, _time1);
    let _datetime2: Date = this.combineDateTime(_date2, _time2);

    /*
    if(_BonpIntervenantID){
    var _datetime1=this.combineDateTime(_date1,_time1);
    var _datetime2=this.combineDateTime(_date2,_time2);
    }else{
    var _datetime1=this.combineDateTimeUTC(_date1,_time1);
    var _datetime2=this.combineDateTimeUTC(_date2,_time2);
    }
    */

    let datetime1a = moment(datetime1).format("YYYY-MM-DD HH:mm:00");
    let datetime2a = moment(datetime2).format("YYYY-MM-DD HH:mm:00");
    let _datetime1a = moment(_datetime1).format("YYYY-MM-DD HH:mm:00");
    let _datetime2a = moment(_datetime2).format("YYYY-MM-DD HH:mm:00");

    console.log(datetime1a + ' | ' + datetime2a + ' , ' + _datetime1a + ' | ' + _datetime2a);
    //console.log();
    //console.log(datetime1.getTime()/1000+' | '+datetime2.getTime()/1000+' , '+_datetime1.getTime()/1000+' | '+_datetime2.getTime()/1000);
    let d1_d1_d2 = datetime1.getTime() > _datetime1.getTime() && datetime1.getTime() < _datetime2.getTime();
    let d2_d1_d2 = datetime2.getTime() > _datetime1.getTime() && datetime2.getTime() < _datetime2.getTime();
    let _d1d1d2 = _datetime1.getTime() > datetime1.getTime() && _datetime1.getTime() < datetime2.getTime();
    let _d2d1d2 = _datetime2.getTime() > datetime1.getTime() && _datetime2.getTime() < datetime2.getTime();
    let equal = ((datetime1.getTime() == _datetime1.getTime()) && (datetime2.getTime() == _datetime2.getTime()));

    if (d1_d1_d2 || d2_d1_d2 || _d1d1d2 || _d2d1d2 || equal) {
      
      /*
      if (d1_d1_d2) { console.log(datetime1a + ' in1 [' + _datetime1a + ' , ' + _datetime2a + ']'); }
      if (d2_d1_d2) { console.log(datetime2a + ' in2 [' + _datetime1a + ' , ' + _datetime2a + ']'); }
      if (_d1d1d2) { console.log(_datetime1a + ' in3 [' + datetime1a + ' , ' + datetime2a + ']'); }
      if (_d2d1d2) { console.log(_datetime2a + ' in4 [' + datetime1a + ' , ' + datetime2a + ']'); }
      */

      return true;
    }
    return false;
  }

  combineDateTime(date: Date, time: Date) {

    let yyyy = date.getFullYear(); // .getUTCFullYear();
    let mm = date.getMonth() + 1; // .getUTCMonth()+1;
    let dd = date.getDate(); // .getUTCDate();
    //console.log('y:'+yyyy+' , m:'+mm+' ,d:'+dd);
    let hh = this.addZero(time.getHours()); // .getUTCHours());
    var mi = this.addZero(time.getMinutes()); // .getUTCMinutes());
    let stringdate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi;
    // let datetime=new Date(stringdate);
    let datetime = new Date(yyyy, mm, dd, hh, mi, 0, 0);
    return datetime;
  }

  combineDateTimeUTC(date: Date, time: Date) {
    let yyyy = date.getUTCFullYear();
    let mm = date.getUTCMonth() + 1;
    let dd = date.getUTCDate();
    let hh = this.addZero(time.getUTCHours());
    var mi = this.addZero(time.getUTCMinutes());
    let stringdate = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':00';
    let datetime = new Date(stringdate);
    return datetime;
  }



  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }


  ReglageDate(date: Date) {
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    let date2 = new Date(this.date.getTime() - userTimezoneOffset);
    return date2;
  }

  /*
  isDateTimeCompleted(i:number){
    let date1=this.corrBonService.bonintervenants[i].date1;
    let time1=this.corrBonService.bonintervenants[i].time1;
    let date2=this.corrBonService.bonintervenants[i].date2;
    let time2=this.corrBonService.bonintervenants[i].time2;
  
    if(date1==null || date1==undefined || time1==null ||time1==undefined || date2==null || date2==undefined || time2==null || time2 == undefined ){
      return false;
    }
    return true;
  
  }
  */

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



openDialogAddTache(){
    
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  dialogConfig.width = "60%";

  let obj2:any={}; // nooooooooooooooooooooooooooooode
  obj2.id=this.data.EquipementIDForTaches;
  obj2.name=this.data.EquipementForTaches;
  obj2.depth=this.data.NiveauForTaches;
  let obj3:any={};
  obj3.data=obj2;
  let node=obj3;
  // console.log();

  dialogConfig.data=node;
  // nooooooooooooooooooooooooooooode

  this.matDialog.open(EquiTacheAddComponent, dialogConfig)
  .afterClosed().subscribe( res=> {
    if( res != undefined && res!=null ) {
    this.getTachesByEquipementID(this.data.EquipementIDForTaches,res.TacheID);
    }
    });
}

getTachesByEquipementID(EquipementID:number,TacheID){
 this.equipementService.getTachesByEquipementID(EquipementID).then(
   res=>{
     this.tacheList=res;
     this.formData.equipement_id=EquipementID;
     if(TacheID>0){
      this.formData.tache_id=TacheID;
      this.formData.tache = this.tacheList.find(x => x.TacheID == TacheID).tache;
     }else{
      this.formData.tache_id='';
     }
    },
   err=>console.log()
 );
}




}