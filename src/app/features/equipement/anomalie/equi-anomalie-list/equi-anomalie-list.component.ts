import { Component, OnInit } from '@angular/core';
import { EquipementService } from '../../services/equipement.service';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { TreeNode } from 'angular-tree-component';

@Component({
  selector: 'app-equi-anomalie-list',
  templateUrl: './equi-anomalie-list.component.html',
  styleUrls: ['./equi-anomalie-list.component.scss']
})
export class EquiAnomalieListComponent implements OnInit {
   
  anomalies=<any>[];
  nodes=<any>[];
  selectedanomalies=<any>[];
  FussionSession=false;
  FusionnerLoading=false;
  AnomalieFusionner=<any>[];

  filterForm:FormGroup=new FormGroup({
    searchFilterText:new FormControl(),
    strict:new FormControl(true),
    auto:new FormControl(true)
  });
  p: number = 1;
  
  constructor(private equipementService:EquipementService) { }

  ngOnInit() {
    this.getListeAnomalies();
    this.FilterValuesChanges();
  }

  getListeAnomalies(){
    this.equipementService.getListeAnomalies().then(
      res=>{console.log(res);this.anomalies=res;},
      err=>console.log('ListeCmdComponent:getListeCmd:',err)
    );
  }

 

  ReceptNodes(e){ this.nodes=e; this.filter(); }
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

  // ---- fusionner ----- 
  Action(e){
    var index = this.selectedanomalies.findIndex(x => x.AnomalieID==e);
    if (index > -1) {this.selectedanomalies.splice(index, 1);}
  }

  ChangeFussionSession(){
   this.FussionSession=!this.FussionSession;
  }

  SelectAnomalie(anomalie){
    if(!this.FusionnerLoading){
    this.AnomalieFusionner=[];
    var index = this.selectedanomalies.findIndex(x => x.AnomalieID==anomalie.AnomalieID);
    if (!(index > -1)) {this.selectedanomalies.push(anomalie);}
    }
  }

  NotExistInSelectedAnomalies(anomalie){
    var index = this.selectedanomalies.findIndex(x => x.AnomalieID==anomalie.AnomalieID);
    if (!(index > -1)) { return true;}
  }

  FusionnerAnomalie(name,description){

    console.log(name+','+description);
    console.log(this.anomalies);
    this.FusionnerLoading=true;
    
    this.equipementService.FusionnerAnomalie(name,description,this.selectedanomalies).then(
     res=>{
    console.log(res);
    
    this.nodes=new Array();
    // this.anomalies=[]; // thaharli zeyda 
    this.filter();
    this.FusionnerLoading=false;
    this.selectedanomalies=[];
    this.AnomalieFusionner.push(res); 
    
      },
     err=>console.log(err)
    ); 

    

    
    
  }
   //#####################




  // ==================================> Filter 
  filter(){
    console.log(this.filterForm.value);
    this.equipementService.filterAnomalie(this.filterForm.value,this.NodesArrToIdsArr(this.nodes)).then(
      res=>{ console.log(res); this.anomalies=res;  this.p = 1; }
      );
   }

 auto(){
   if(this.filterForm.controls['auto'].value==true){
     console.log(this.filterForm.value);
     this.filter();
   }
 }

 resetFilter(){
   this.filterForm.patchValue({
    searchFilterText:'',
    strict:true
   });
   this.filter();
 }


 FilterValuesChanges(){
 
   this.filterForm.controls.searchFilterText.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   this.filterForm.controls.strict.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )

 }
   
 // ###################################



}
