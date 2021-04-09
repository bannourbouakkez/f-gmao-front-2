import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../../services/fournisseur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { CmdService } from '../services/cmd.service';
import { MatDialog } from '@angular/material';
import { AppercuImpressionCmdComponent } from '../appercu-impression-cmd/appercu-impression-cmd.component';

import { debounceTime , distinctUntilChanged  , map} from 'rxjs/operators';

@Component({
  selector: 'app-imprimer-cmd',
  templateUrl: './imprimer-cmd.component.html',
  styleUrls: ['./imprimer-cmd.component.scss']
})
export class ImprimerCmdComponent implements OnInit {

  fournisseurs=<any>[];
  fournisseur_id:number;
  cmds=<any>[];
  form:FormGroup;
  CmdIds=[3,5,6];
  
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
      ouvert:new FormControl(true),
      ferme:new FormControl(true),
      vide:new FormControl(true)
    });
    // ######
    p: number = 1;

  constructor( private cmdService:CmdService, private fournisseurService:FournisseurService,
    private _currentRoute: ActivatedRoute,private _router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.formInit();
    let FournisseurID = +this._currentRoute.snapshot.paramMap.get('id');
    if(FournisseurID>0){ // nthabbit yatla3ch null zeda normalement 
      //this.getReception(CmdRecID);
      this.getFournisseurs(FournisseurID);
      this.fournisseur_id=FournisseurID;

    }else{
      this.getFournisseurs();
    }

    this.FilterValuesChanges();

  }

  getFournisseurs(FournisseurID?){
    this.fournisseurService.getFournisseurs().then(
      res=>{
        this.fournisseurs=res;
        if(FournisseurID>0){
           this.form.controls['fournisseur'].setValue(FournisseurID);
           this.cmds=this.getFournisseurCmds(FournisseurID);
        }
      },
      err=>console.log('ImprimerCmdComponent:getFournisseurs:',err)
    )
  }

  formInit(){
    this.form=new FormGroup({
      fournisseur:new FormControl()
    });
  }


  selectFournisseur(e){ this.fournisseur_id=e.value; if(e.value>0){ 
    this.getFournisseurCmds(e.value);
  } if(e.value==0){this.cmds=[];}}

  getFournisseurCmds(FournisseurID:number){
    this.cmdService.getFournisseurCmds(FournisseurID).then(
      res=>{console.log(res); 
        this.cmds=res;
        for (let i = 0; i < this.cmds.length; i++) {  
          this.cmds[i]['formControl'] = new FormControl(false);}
      },
      err=>console.log('ImprimerCmdComponent:getFournisseurCmds:',err)
    );
  }


  Imprimer(cmdsidsaimp:NgForm){
    let CmdIds=[];
    for (var i = 0;  i<this.cmds.length; i++ ) {
      if(this.cmds[i].formControl.value == true){
        CmdIds.push(this.cmds[i].CommandeID);
      }
    }

    this.cmdService.Imprimer(CmdIds).then(
      res=>{
      console.log(res);
      this.openDialog(res);
      },
      err=>console.log('ImprimerCmdComponent:Imprimer:',err)
    );
  }

  openDialog(res){
    const dialogRef = this.dialog.open(AppercuImpressionCmdComponent, {
      width: '90%',
      data: {data:res}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('ipression done ');
    });
  }




  
  // ==================================> Filter 
  filter(){
    console.log(this.filterForm.value);
    this.cmdService.ImprimerCmdFilter(this.filterForm.value,this.fournisseur_id).then(
      res=>{ 
         this.cmds=res;
         for (let i = 0; i < this.cmds.length; i++) {  
          this.cmds[i]['formControl'] = new FormControl(false);
         }
       }
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
    ouvert:true,
    ferme:true,
    vide:true
   });
   this.formDate.reset();
   this.formDate.patchValue({minformdate:this.firstDay});
   this.filter();
 }


 FilterValuesChanges(){
 
   this.filterForm.controls.searchFilterText.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   this.filterForm.controls.ouvert.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )
   
   this.filterForm.controls.ferme.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )
 
   this.filterForm.controls.vide.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )

   }
   
 // ###################################
  

}
