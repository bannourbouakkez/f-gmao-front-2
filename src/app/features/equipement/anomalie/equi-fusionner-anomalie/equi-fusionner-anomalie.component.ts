import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { MatSelect } from '@angular/material';

import { Bank, BANKS } from './demo-data';
import { GlobalService } from 'src/app/shared/global.service';

@Component({
  selector: 'app-equi-fusionner-anomalie',
  templateUrl: './equi-fusionner-anomalie.component.html',
  styleUrls: ['./equi-fusionner-anomalie.component.scss']
})
export class EquiFusionnerAnomalieComponent implements OnInit, AfterViewInit, OnDestroy {
// https://stackblitz.com/edit/ngx-mat-select-search?file=src%2Fapp%2Fexamples%2F02-multiple-selection-example%2Fmultiple-selection-example.component.ts

  protected banks= <any>[] ;
  public bankMultiCtrl: FormControl = new FormControl();
  public bankMultiFilterCtrl: FormControl = new FormControl();
  public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('multiSelect',{static:true}) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(private globalService:GlobalService) { }

  ngOnInit() {
    this.globalService.getUsersPosts([]).then(
      res=>{
        let inialValues=new Array(2,5);
        this.seletMultiMyFunc(res.users,inialValues);
      },
      err=>console.log(err)
    );
  }

  
  envoyer(){
    console.log(this.bankMultiCtrl.value);
  }



// ------------------------- select Multi with Search --------------------------

 seletMultiMyFunc(res,valeursInitiales){

  let arr=new Array(); arr=res;
  for(let i=0;i<arr.length;i++){
    let obj:any={}; 
    obj.name=arr[i].name;
    obj.id=arr[i].id;
    this.banks.push(obj);
  }

let newvaleursInitiales=new Array();
for(let j=0;j<this.banks.length;j++){
  if(valeursInitiales.includes(this.banks[j].id)){
    newvaleursInitiales.push(this.banks[j]);
  }
}

this.bankMultiCtrl.setValue(newvaleursInitiales);

this.filteredBanksMulti.next(this.banks.slice());
this.bankMultiFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterBanksMulti();
  });

}

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  //Sets the initial value after the filteredBanks are loaded initially
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a, b) => a && b && a.id === b.id;
      });
  }

  protected filterBanksMulti() {
    if (!this.banks) {
      return;
    }
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanksMulti.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

// ########################### select Multi with Search ###########################



}
