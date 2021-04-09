import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import {ArrayDataSource} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';
import { EquipementService } from '../../services/equipement.service';
import { TreeNode } from 'angular-tree-component';
import { MatDialogConfig, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

interface FoodNode {
  id:number;
  name: string;
  children?: FoodNode[];
}
@Component({
  selector: 'app-equi-arbre-for-select',
  templateUrl: './equi-arbre-for-select.component.html',
  styleUrls: ['./equi-arbre-for-select.component.scss']
})
export class EquiArbreForSelectComponent implements OnInit {


  loaded=true;
  testLoading=false;
  FirstClick=false;
  
  nodes=<any>[];
  options ={};
  niveaux=<any>[];
  NiveauMax:number=0;
  NiveauMin:number=0;






  @ViewChild('tree',{static:false}) tree;

  constructor(private equipementService:EquipementService,private matDialog: MatDialog,
              public dialogRef: MatDialogRef<EquiArbreForSelectComponent>,@Inject(MAT_DIALOG_DATA) public data ) { }

/*
    public dialogRef: MatDialogRef<Confirmation>,
    @Inject(MAT_DIALOG_DATA) public data) {}

    confirmer(): void {this.dialogRef.close(1); }
    annuler(): void {this.dialogRef.close(0); }
*/


  ngOnInit() {
    this.options= {
      getChildren: (node:TreeNode) => {
         return this.getNodeJustChilds(node.id);
      }
    };
    this.getRacine(1);
  }
  
  getRacine(Niveau:number){
  this.equipementService.getRacine(Niveau).then(
    res=>{this.nodes=res.racine;this.niveaux=res.Niveaux;this.NiveauMax=res.NiveauMax;this.NiveauMin=res.NiveauMin;},
    err=>console.log(err)
  );
  }
/*
  getNodeByNodeIDAndByNiveau(NodeID:number,Niveau:number){
    this.equipementService.getNodeByNodeIDAndByNiveau(NodeID,Niveau).then(
      res=>{this.nodes=res;},
      err=>console.log(err)
    );
  }
*/

  getNodeJustChilds(NodeID){
  this.equipementService.getNodeJustChilds(NodeID).then(
    res=>console.log(res)
  );
  return this.equipementService.getNodeJustChilds(NodeID);
  }
/*
  getNodeRacine(NodeID:number,Niveau:number){ 
    return this.equipementService.getNodeRacine(NodeID,Niveau);
  }
*/

  getALL(){
    if(!this.FirstClick){
    this.getArbre();
    }else{
      this.expandAll();
    }
  }
  getArbre(){
    this.testLoading=true;
    this.equipementService.getArbre().then(
      res=>{
         this.loaded=true;
         this.nodes[0].children=res;
         this.options={};
         this.expandAll();
         this.expandAll();
         this.testLoading=false;
         this.FirstClick=true;

        
      },
      err=>console.log(err)
    );

 
  
  }

  SelectNode(node: TreeNode){
    /*
    let NodeInfo:any={};
    NodeInfo.NodeID=node.data.id;
    NodeInfo.NodeNom=node.data.name;
    NodeInfo.NiveauNom=this.NiveauNomByNiveau(node.data.depth);
    */
    this.equipementService.getNiveauDetByEquipementID(node.data.id).then(
      res=>{
        let obj:any={};
        obj.node=node;
        obj.niveaus=res.niveaus;
        this.dialogRef.close(obj);
      },
      err=>console.log(err)
    );
  }

  NiveauNomByNiveau(niveau:number){
    for (let i = 0; i < this.niveaux.length; i++) {
     if(niveau==this.niveaux[i].niveau){
       return this.niveaux[i].nom;
     }
    }
  }


  //---------------------------- Action ----------------------------

  expandAll(){this.tree.treeModel.expandAll();}
  CloseAll(){this.tree.treeModel.collapseAll();}
  childrenCount(node: TreeNode): string {return node && node.children ? `${node.children.length}` : '';}  
  








  // just béch nthahhir el loading  najjim na77éha el partie héthi kémla zedtha f design 3ala fazet loading ----------------------------------- 
/*
  NodeLoaded=false;
NoadDifinedTest=true;
untilNodeGetted(){
  if(!this.RecursiveAllLoadedResult()){
    setTimeout(() => {
     this.untilNodeGetted();
      },1000);
  }else{
    this.NodeLoaded=true;
    //this.CloseAll();
    //this.expandAll();
    
  }
}
RecursiveAllLoadedResult(){
  this.NoadDifinedTest=true;
  this.RecursiveAllLoaded(this.nodes);
  return this.NoadDifinedTest;
}

RecursiveAllLoaded(obj)
{
    for (var k in obj)
    {
        if (obj[k].hasOwnProperty('children') && obj[k].hasChildren==true)
          { 
            let Node:TreeNode;
            Node = this.tree.treeModel.getNodeById(obj[k].id);
            if(Node==undefined){this.NoadDifinedTest=false;}
            this.RecursiveAllLoaded(obj[k].children); 
          }
        else{
            let Node:TreeNode;
            Node = this.tree.treeModel.getNodeById(obj[k].id);
            if(Node==undefined){this.NoadDifinedTest=false;}        }
    }
}
*/
  //###################################################################
  
}