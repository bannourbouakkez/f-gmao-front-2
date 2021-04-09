import { Component, OnInit, ViewChild } from '@angular/core';

import {ArrayDataSource} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';
import { EquipementService } from '../../services/equipement.service';
import { TreeNode } from 'angular-tree-component';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material';
import { EquiFeuilleAddComponent } from '../equi-feuille-add/equi-feuille-add.component';
import { EditCompComponent } from '../arbre-components/edit-comp/edit-comp.component';

interface FoodNode {
  id:number;
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-equi-arbre',
  templateUrl: './equi-arbre.component.html',
  styleUrls: ['./equi-arbre.component.scss']
})
export class EquiArbreComponent implements OnInit {

  //---------- breadcrumb ---------
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/equipement',title:'equipement'} ,
    {url:'gmao/equipement/equi/arbre',title:'arbre'}
  ];
  //###############################

  loaded=true;
  testLoading=false;
  FirstClick=false;
  
  /*
  TREE_DATA : FoodNode[]=[];
  treeControl=new NestedTreeControl<FoodNode> (node => node.children);
  dataSource=new ArrayDataSource(this.TREE_DATA);
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
  */
  
  nodes=<any>[];
  options ={};
  NiveauMax:0;
  @ViewChild('tree',{static:false}) tree;

  
  constructor(private equipementService:EquipementService,private matDialog: MatDialog) { }

  ngOnInit() {
    this.options= {
      getChildren: (node:TreeNode) => {
         return this.getNodeJustChilds(node.id); // mrigla kima yelzem 
        //return this.getNodeByNodeIDAndByNiveau(node.id,1); // tbaddil el arbre kol b arbre jdida 
        //return this.getNodeRacine(node.id,1); // tzid kima el mrigla ama redandance mte3 nafs el node elli t7élha 
      }
    };
    //this.getArbre();
    this.getRacine(1);
    //this.nodes=this.getNodeByNodeIDAndByNiveau(1,1);
  }
  
  getRacine(Niveau:number){
    
  this.equipementService.getRacine(Niveau).then(
    res=>{
      this.nodes=res.racine;
      this.NiveauMax=res.NiveauMax;
    },
    err=>console.log(err)
  );

  }

  getNodeByNodeIDAndByNiveau(NodeID:number,Niveau:number){
    this.equipementService.getNodeByNodeIDAndByNiveau(NodeID,Niveau).then(
      res=>{this.nodes=res;},
      err=>console.log(err)
    );
  }


  getNodeJustChilds(NodeID){
  this.equipementService.getNodeJustChilds(NodeID).then(
    res=>console.log(res)
  );
  return this.equipementService.getNodeJustChilds(NodeID);
  }

  getNodeRacine(NodeID:number,Niveau:number){ 
    return this.equipementService.getNodeRacine(NodeID,Niveau);
    /*.then(res=>{this.nodes=res;},err=>console.log(err));*/
  }


  getALL(){
    if(!this.FirstClick){
      this.getArbre();
      }else{
        this.expandAll();
      }
  }

  getArbre(){
     // No loading // get all arbre wthout racine 
     this.testLoading=true;
    this.equipementService.getArbre().then(
      res=>{
         this.loaded=true;
         //this.nodes=res;
         console.log('getArbre:');
         console.log(res);
         this.nodes[0].children=res;
         console.log(this.nodes);
         this.options={};
         this.expandAll();

         this.testLoading=false;
         this.FirstClick=true;
         // let TREE_DATA=res as FoodNode[];
         // this.treeControl = new NestedTreeControl<FoodNode> (node => node.children);
         // this.dataSource = new ArrayDataSource(TREE_DATA);
         
      },
      err=>console.log(err)
    );
  

  }


  //////////////////// NOUVeau Edit w Afficher //////////////////////////////////////////////////


  editNode(parent: TreeNode) {
    this.tree.treeModel.setFocus(true);
    let name:string;
    let id:number;
    let EquipementID=parent.id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "500px";
    dialogConfig.data=EquipementID;
    this.matDialog.open(EditCompComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if(res!=false && res!=null){


        
        if( this.tree.treeModel.getNodeById(parent.id).data.name!=res){
          this.tree.treeModel.getNodeById(parent.id).data.name=res;
          this.tree.treeModel.update();
        }
      
        /*
      name=res;
       let  value = {
        id:id,
        name:name,
        depth: parent.data.depth+1,
      };
      //console.log('value='+value+' , res='+res);
      if (parent) {

      //if(!parent.data.hasOwnProperty('children')){
      if(!parent.data.hasChildren){
      parent.data.hasChildren=true;  
      parent.data.children=[];
      parent.data.children.push(value);
      parent.expand();
      }else{
        // hasChildre=true
        if(parent.data.hasOwnProperty('children')){
          parent.data.children.push(value);
          parent.expand();
        }else{
          parent.expand();
          //expand
          //3andou children ama mazel msakk
          // rien a faire
          //const someNode = this.tree.treeModel.getNodeById('someId');
          //someNode.expand();
        }

      }  


      }
       this.tree.treeModel.update();
    
*/









    }else{
      console.log('res false ou null');
    }

    });

  
   }

  //##############################################################################################



  //---------------------------- Action ----------------------------

  expandAll(){
  this.tree.treeModel.expandAll();
  }
  CloseAll(){
    this.tree.treeModel.collapseAll();
    }


  addNode(parent: TreeNode) {
    this.tree.treeModel.setFocus(true);
    let name:string;
    let id:number;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "500px";
    dialogConfig.data=parent.id;
    this.matDialog.open(EquiFeuilleAddComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if(res!=false && res!=null){
      id=res.id; name=res.name;
     
       let  value = {
        id:id,
        name:name,
        depth: parent.data.depth+1,
        hasChildren:false
      };
      //console.log('value='+value+' , res='+res);
      console.log('res:');
      console.log(res);
      console.log('value:');
      console.log(value);
     
      if (parent) {

      //if(!parent.data.hasOwnProperty('children')){
      if(!parent.data.hasChildren){
      parent.data.hasChildren=true;  
      parent.data.children=[];
      parent.data.children.push(value);
      parent.expand();
      }else{
        // hasChildre=true
        if(parent.data.hasOwnProperty('children')){
          parent.data.children.push(value);
          parent.expand();
        }else{
          parent.expand();
          //expand
          //3andou children ama mazel msakk
          // rien a faire
          //const someNode = this.tree.treeModel.getNodeById('someId');
          //someNode.expand();
        }

      }  


      }
       this.tree.treeModel.update();
    }else{
      console.log('Erreur maybe name exist or null ');
    }

    });

  
   }

   removeNode(node: TreeNode): void {
    if (node.parent != null) {
        this.equipementService.deleteEquipement(node.id).then(
          res=>{
            if(res){
            node.parent.data.children.splice(node.parent.data.children.indexOf(node.data), 1);
            this.tree.treeModel.update();
            }
          },
          err=>console.log(err)
        );
       

    }
  }



   childrenCount(node: TreeNode): string {
    return node && node.children ? `${node.children.length}` : '';
  }




  SelectNiveau(node: TreeNode){
   console.log(node.data);
  }
  
  

  ReceptNode(NodeInfo){
   //console.log(NodeInfo);
  }

}
