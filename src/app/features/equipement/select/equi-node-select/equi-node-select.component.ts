import { Component, OnInit, Output , EventEmitter, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EquiArbreForSelectComponent } from '../equi-arbre-for-select/equi-arbre-for-select.component';
import { EquipementService } from '../../services/equipement.service';

@Component({
  selector: 'app-equi-node-select',
  templateUrl: './equi-node-select.component.html',
  styleUrls: ['./equi-node-select.component.scss']
})
export class EquiNodeSelectComponent implements OnInit {

  @Output() emit: EventEmitter<any> = new EventEmitter<any>();
  @Input() InpuEquipementID:number;
  @Input() InpuName:string;

  EquipementID:number=0;
  res:any={};
  niveaus=<any>[];
  
  constructor( private matDialog: MatDialog,private equipementService:EquipementService) { }

  ngOnInit() {
    if(this.InpuEquipementID>0){
      this.equipementService.getNiveauDetByEquipementID(this.InpuEquipementID).then(
        res=>{ /*this.EquipementID=this.InpuEquipementID;*/  this.niveaus=res.niveaus;},
        err=>console.log(err)
      );
    }
   // this.NodeInfo.NodeID=0;
   // this.NodeInfo.NodeNom="";
   // this.NodeInfo.NiveauNom="";
  }

  ResmiseInpu(){
    this.InpuEquipementID=0;
    this.InpuName="";
  }

  SelectNodeDialog(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      //dialogConfig.disableClose = true;
      dialogConfig.width = "500px";
      dialogConfig.data="dialog";
      this.matDialog.open(EquiArbreForSelectComponent, dialogConfig)
      .afterClosed().subscribe( res=> {
        
        if( res != undefined && res!=null  && ( res.node.data.id != this.EquipementID) ){
        this.EquipementID=res.node.data.id;
        this.res=res;
        this.niveaus=res.niveaus;

        this.ResmiseInpu();
          /*
        this.NodeInfo.NodeID=res.NodeID;
        this.NodeInfo.NodeNom=res.NodeNom;
        this.NodeInfo.NiveauNom=res.NiveauNom;
        */
        
        this.emit.emit(res.node);

        }

        });
  }


}
