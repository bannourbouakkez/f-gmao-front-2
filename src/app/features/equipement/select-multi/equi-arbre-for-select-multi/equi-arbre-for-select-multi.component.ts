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
  selector: 'app-equi-arbre-for-select-multi',
  templateUrl: './equi-arbre-for-select-multi.component.html',
  styleUrls: ['./equi-arbre-for-select-multi.component.scss']
})
export class EquiArbreForSelectMultiComponent implements OnInit {


  loaded=true;
  NoadDifinedTest=true;
  NodeLoaded=false;
  
  nodes=<any>[];
  selectednodes=<any>[];
  options ={};
  niveaux=<any>[];
  NiveauMax:number=0;
  NiveauMin:number=0;
  selectedIds=[];

  @ViewChild('tree',{static:false}) tree;

  constructor(private equipementService:EquipementService,private matDialog: MatDialog,
              public dialogRef: MatDialogRef<EquiArbreForSelectMultiComponent>,@Inject(MAT_DIALOG_DATA) public data ) { }

/*
    public dialogRef: MatDialogRef<Confirmation>,
    @Inject(MAT_DIALOG_DATA) public data) {}

    confirmer(): void {this.dialogRef.close(1); }
    annuler(): void {this.dialogRef.close(0); }
*/


  ngOnInit() {
    this.selectedIds=this.NodesArrToIdsArr(this.data);
    this.options= {
      getChildren: (node:TreeNode) => {
         return this.getNodeJustChilds(node.id);
      }
    };
    this.getRacine(0);
  }
  
  getRacine(Niveau:number){
  this.equipementService.getRacine(Niveau).then(
    res=>{
      this.nodes=res.racine;this.niveaux=res.Niveaux;this.NiveauMax=res.NiveauMax;this.NiveauMin=res.NiveauMin;
      this.getArbre();
    },
    err=>console.log(err)
  );
  }

  getNodeJustChilds(NodeID){
  this.equipementService.getNodeJustChilds(NodeID).then(
    res=>console.log(res)
  );
  return this.equipementService.getNodeJustChilds(NodeID);
  }

  getALL(){this.getArbre();}
  getArbre(){
    this.equipementService.getArbre().then(
      res=>{
         this.loaded=true;
         this.nodes[0].children=res;
         this.options={};

         //this.RecursiveAllLoadedResult();
         //console.log(this.nodes.length);
         this.untilNodeGetted();
        // this.AffectSelected();
         //this.CloseAll();
         //this.expandAll(); 
         //this.RecursiveAllLoaded(this.nodes);
      },
      err=>console.log(err)
    );
  }


  Envoyer(){
    let tab=this.IdsArrToNodesArr(this.selectedIds)
    this.dialogRef.close(tab);
  }



ShowSelected(){this.RecursiveGetSelected(this.nodes);}
AffectSelected(){this.RecursiveAffectSelected(this.nodes);}

onChange(node:TreeNode){
  let id=node.data.id;
  console.log('onChange:'+node.isActive)
  if(!node.isActive){
    var index = this.selectedIds.findIndex(x => x==id);
    if (index > -1) {this.selectedIds.splice(index, 1);}
    //console.log('delete :'+id); console.log(this.selectedIds);
  }else{
    if(!this.selectedIds.includes(id)){
      this.selectedIds.push(id);
      //console.log('push :'+id); console.log(this.selectedIds);
    }
  }
}

RecursiveGetSelected(obj)
{
    for (var k in obj)
    {
        if (obj[k].hasOwnProperty('children') && obj[k].hasChildren==true)
          { 
            let Node:TreeNode;
            Node = this.tree.treeModel.getNodeById(obj[k].id);
            if(Node.isActive){
            this.selectednodes.push(Node.data);
            }
            this.RecursiveGetSelected(obj[k].children);
          }
        else{
          let Node:TreeNode;
          Node = this.tree.treeModel.getNodeById(obj[k].id);
          if(Node.isActive){
            this.selectednodes.push(Node.data);
          }
        }
    }
}

RecursiveAffectSelected(obj)
{
    for (var k in obj)
    {
        if (obj[k].hasOwnProperty('children') && obj[k].hasChildren==true)
          { 
            if(this.selectedIds.includes(obj[k].id)){
              let Node:TreeNode;
              Node = this.tree.treeModel.getNodeById(obj[k].id);
              if(!Node.isActive){Node.setActiveAndVisible(true);}
            }
            this.RecursiveAffectSelected(obj[k].children); 
          }
        else{
          if(this.selectedIds.includes(obj[k].id)){
            let Node:TreeNode;
            Node = this.tree.treeModel.getNodeById(obj[k].id);
            if(!Node.isActive){Node.setActiveAndVisible(true);}
          }
          let Node:TreeNode;
          Node = this.tree.treeModel.getNodeById(obj[k].id);
          if(Node.isActive){this.selectednodes.push(Node.data);}
        }
    }
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

RecursiveAllLoadedResult(){
  this.NoadDifinedTest=true;
  this.RecursiveAllLoaded(this.nodes);
  return this.NoadDifinedTest;
}


untilNodeGetted(){
  if(!this.RecursiveAllLoadedResult()){
    setTimeout(() => {
     this.untilNodeGetted();
      },1000);
  }else{
    this.NodeLoaded=true;
    this.AffectSelected();
    this.CloseAll();
    //this.expandAll();
    
  }
}


IdsArrToNodesArr(ArrIds){
  let arr=new Array();
  let Node:TreeNode;
  for (let i = 0; i < ArrIds.length; i++) {
    Node = this.tree.treeModel.getNodeById(ArrIds[i]);
    arr.push(Node);
   }
  return arr; 
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

onFilterEmpty(text:string){
 if(text==""){
   this.tree.treeModel.filterNodes("");
   this.CloseAll();
 }
}


deleteNode(id){
  let Node:TreeNode;
  Node = this.tree.treeModel.getNodeById(id);
  Node.toggleActivated(true);
    var index = this.selectedIds.findIndex(x => x==id);
    if (index > -1) {this.selectedIds.splice(index, 1);}
}

  //---------------------------- Action ----------------------------

  expandAll(){this.tree.treeModel.expandAll();}
  CloseAll(){this.tree.treeModel.collapseAll();}
  childrenCount(node: TreeNode): string {return node && node.children ? `${node.children.length}` : '';}  
  
}