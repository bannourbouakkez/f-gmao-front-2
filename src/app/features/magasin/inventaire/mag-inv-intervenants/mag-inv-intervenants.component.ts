import { Component, OnInit } from '@angular/core';
import { InventaireService } from '../../services/inventaire.service';
import { FormGroup, FormControl } from '@angular/forms';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';

@Component({
  selector: 'app-mag-inv-intervenants',
  templateUrl: './mag-inv-intervenants.component.html',
  styleUrls: ['./mag-inv-intervenants.component.scss']
})
export class MagInvIntervenantsComponent implements OnInit {

  inventaires=<any>[];
  intervenants=<any>[];
   // ====> Filter 
   date = new Date();
   firstDay = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
   formDate:FormGroup=new FormGroup({
    minformdate:new FormControl(this.firstDay),
    maxformdate:new FormControl()
   });
   //-------------
   filterForm:FormGroup=new FormGroup({
     searchFilterText:new FormControl(),
     datemin:new FormControl(this.firstDay),
     datemax:new FormControl(),
     auto:new FormControl(true),
     Enregistrement:new FormControl(true),
     Correction:new FormControl(true)
   });

  constructor(private inventaireService:InventaireService) { }

  ngOnInit() {
    this.getInventaires();
    this.FilterValuesChanges();
  }

  getInventaires(){
    this.inventaireService.getInventaires().then(
      res=>{
        this.inventaires=res.inventaires;this.intervenants=res.intervenants
      },
      err=>console.log(err)
    );
   }

   StringListeToArray(StringListe){
     var splitted = StringListe.split(",");
     splitted.splice(-1,1);
     splitted=this.arrayStringToArrayNumber(splitted);
     return splitted;
   }

   arrayStringToArrayNumber(ArtIDs){
    let arrIDs=<any>[];
    for (let i = 0; i < ArtIDs.length; i++) {
      arrIDs[i]=+ ArtIDs[i];
    }
    return arrIDs;
   }

   NameIntervenantByID(IntervenantID:number){
    for (let i = 0; i < this.intervenants.length; i++) {
     if(this.intervenants[i].IntervenantID==IntervenantID){
       return this.intervenants[i].name;
     }
    }
   }
    
   // ==================================> Filter 
  
   filter(){
     console.log(this.filterForm.value);
     this.inventaireService.filterInventaires(this.filterForm.value).then(
       res=>{ this.inventaires=res; }
       );
    }
 
  auto(){
    if(this.filterForm.controls['auto'].value==true){
      console.log(this.filterForm.value);
      this.filter();
    }
  }
 
  dateMinFilter(e){
    let dmin = new Date(e.value);
    dmin.setHours(0); dmin.setMinutes(0); dmin.setSeconds(0); dmin.setMilliseconds(0); 
    this.filterForm.patchValue({datemin:dmin}); 
    this.auto();
  }
  dateMaxFilter(e){
    let dmax = new Date(e.value);
    dmax.setHours(0); dmax.setMinutes(0); dmax.setSeconds(0); dmax.setMilliseconds(0); 
    this.filterForm.patchValue({datemax:dmax}); 
    this.auto();
  }
 
  resetFilter(){
    this.filterForm.patchValue({
     searchFilterText:'',
     datemin:this.firstDay,
     datemax:'',
     Enregistrement:true,
     Correction:true
      });
    this.formDate.reset();
    this.formDate.patchValue({minformdate:this.firstDay});
    this.filter();
  }
 
 
  FilterValuesChanges(){
  
    this.filterForm.controls.searchFilterText.valueChanges
    .pipe(debounceTime(500),distinctUntilChanged())
    .subscribe( value => this.auto() )
 
    this.filterForm.controls.Enregistrement.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
    
    this.filterForm.controls.Correction.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
  
 
    }
    
  // ###################################
 
 

}
