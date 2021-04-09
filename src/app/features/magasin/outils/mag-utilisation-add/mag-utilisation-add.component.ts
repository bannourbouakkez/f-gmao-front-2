import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OutilService } from '../../services/outil.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-mag-utilisation-add',
  templateUrl: './mag-utilisation-add.component.html',
  styleUrls: ['./mag-utilisation-add.component.scss']
})



export class MagUtilisationAddComponent implements OnInit {

  UseID:number=0;
  UseForm:FormGroup;
  outils=<any>[];
  intervenants=<any>[];
  equipements=<any>[];
  sous_equipements=<any>[];
  les_unites=<any>[];
  lignes=<any>[];
  
  arrWithZero=this.returnArrWithZero(9);


  constructor( private fb:FormBuilder,private outilService:OutilService,private _currentRoute: ActivatedRoute,private router:Router) { }


  ngOnInit() {
    this.UseFormOnInit();
    
    let UseID = +this._currentRoute.snapshot.paramMap.get('id');
    if(UseID>0){
      this.UseID=UseID;
      let source='modification';
      this.outilService.getUseAndTables(UseID,source).then(
        res=>{
        //if(res.use.isOpened==1){
        this.outils=res.outils;
        this.equipements=res.equipements;
        this.les_unites=res.les_unites;
        this.intervenants=res.intervenants;
        //this.lignes=res.lignes;
        this.UseForm.setValue(res.use);
        this.changeHeure();this.changeMinute();
       // }else{
        //  this.router.navigate(['/magasin/outils/utilisations/0']);
        //}

        },
        err=>console.log(err)
      );
      }else{
        let source='ajouter';
        this.getUseAndTables(0,source);
      }
    
  }

  UseFormOnInit(){
    this.UseForm=this.fb.group({
      UseID:[''],
      outil_id:[''],
      intervenant_id:[''],
      leunite_id:[''],
     // ligne_id:[''],
      equipement_id:[''],
      sous_equipement_id:[''],
      date:[''],
      heure:['00'],
      minute:['00'],
      estimation:[''],
      periode:['heure'],
      date_cloture:[''],
      isOpened:[1],
      NbDeModif:[0],
      exist:[1],
      created_at:[''],
      updated_at:['']
    });
  }


  getUseAndTables(UseID:number,source:string){
    this.outilService.getUseAndTables(UseID,source).then(
      res=>{
        this.outils=res.outils;
        this.equipements=res.equipements;
        this.les_unites=res.les_unites;
        this.intervenants=res.intervenants;
        //this.lignes=res.lignes;
       //this.outil=res.outil;
      },
      err=>console.log(err)
    );
   }

   changeHeure(){
     let heure=this.UseForm.controls['heure'].value;
     if(heure>23){this.UseForm.patchValue({heure:0});}
     if(heure<0){this.UseForm.patchValue({heure:23});}
     if(heure>=0 && heure<=9){ this.UseForm.patchValue({heure:this.arrWithZero[heure]});}
    }

   changeMinute(){
    var minute=this.UseForm.controls['minute'].value;
    if(minute>59){this.UseForm.patchValue({minute:0});}
    if(minute<0){this.UseForm.patchValue({minute:59});}
    if(minute>=0 && minute<=9){this.UseForm.patchValue({minute:this.arrWithZero[minute]});}
   }

   returnArrWithZero(num:number){
     let arr=new Array(); for(let i=0;i<=num;i++){ let withZero='0'+i; arr.push(withZero); } return arr;
   }
   
   submit(){

   if(this.UseID==0){
   this.outilService.addUse(this.UseForm.value).then(
     res=>console.log(res),
     err=>console.log(err)
   );
   }
   
  if(this.UseID>0){
   this.outilService.editUse(this.UseForm.value,this.UseID).then(
    res=>console.log(res),
    err=>console.log(err)
  );
  }

   }


}
