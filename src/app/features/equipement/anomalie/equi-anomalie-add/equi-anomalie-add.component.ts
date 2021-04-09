import { Component, OnInit, Inject, Optional } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { EquipementService } from '../../services/equipement.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-equi-anomalie-add',
  templateUrl: './equi-anomalie-add.component.html',
  styleUrls: ['./equi-anomalie-add.component.scss']
})
export class EquiAnomalieAddComponent implements OnInit {
  
  Form:FormGroup;
  nodes=<any>[];
  Loaded=false;
  AnomalieID:number=0;
  anomalie:string;
  semblables=<any>[];
  SemblablesLoading=false;
  strict=0;
  LoadingReactBtn1=false;

  constructor(private equipementService:EquipementService,private _currentRoute: ActivatedRoute,private fb: FormBuilder
             ,public dialogRef: MatDialogRef<EquiAnomalieAddComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.initForm();
    let AnomalieID = +this._currentRoute.snapshot.paramMap.get('id');
    if(AnomalieID>0){
      this.AnomalieID=AnomalieID;
      this.getAnomalie(AnomalieID);
     }else{
       this.Loaded=true;
      if(this.data!=null){
       this.nodes.push(this.data);
      }
     }
    this.Form.controls.anomalie.valueChanges.pipe(debounceTime(500),distinctUntilChanged())
    .subscribe( value => this.Semblables(value) )
  }

  getAnomalie(AnomalieID:number){
    this.equipementService.getAnomalie(AnomalieID).then(
      res=>{
         this.nodes=res.equipements;
         this.Form.setValue(res.anomalie);
         this.Loaded=true; 
         this.anomalie=res.anomalie.anomalie;
        },
      err=>console.log(err)
    );
  }

  ReceptNodes(e){ this.nodes=e; }

  initForm() {
    this.Form = this.fb.group({
      AnomalieID: [''],
      anomalie: ['', Validators.required],
      NB: [0],
      description: [''],
      exist: [1],
      created_at: [''],
      updated_at: ['']
    });
  }

  submit(){
    if(this.Form.valid && this.nodes.length>0){
      if(!this.LoadingReactBtn1){
        this.LoadingReactBtn1=true;
       this.equipementService.addAnomalie(this.AnomalieID,this.Form.value,this.NodesArrToIdsArr(this.nodes)).then(
         res=>{ 
          if(this.data!=null){
            this.dialogRef.close(res);
            }
          },
         err=>console.log(err)
       );
    }
  }
  }
  
  NodesArrToIdsArr(ArrNodes){
    let arr=new Array();
    let Node:TreeNode;
    for (let i = 0; i < ArrNodes.length; i++) {
      Node=ArrNodes[i];
      let ID=Node.data.id;
      arr.push(ID);
     }
    return arr; 
  }

  Semblables(value){
    this.semblables=[];
    if(value!="" && value!=this.anomalie){
    this.SemblablesLoading=true; 
    this.equipementService.getAnomalieSemblables(value,this.strict).then(
     res=>{this.semblables=res; this.SemblablesLoading=false;},
     err=>console.log(err)
    );
  }
  }


}
