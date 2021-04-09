import { Component, OnInit, Output , EventEmitter, Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EquiArbreForSelectMultiComponent } from '../equi-arbre-for-select-multi/equi-arbre-for-select-multi.component';

@Component({
  selector: 'app-equi-node-select-multi',
  templateUrl: './equi-node-select-multi.component.html',
  styleUrls: ['./equi-node-select-multi.component.scss']
})
export class EquiNodeSelectMultiComponent implements OnInit {


  @Output() emit: EventEmitter<any> = new EventEmitter<any>();
  @Input() inputnodes:[];  
  receptednodes=<any>[];
 
  
  constructor( private matDialog: MatDialog) { }

  ngOnInit() {
   this.receptednodes=this.inputnodes;
  }
  
  ngOnChanges(){
    this.receptednodes=this.inputnodes;
  }

  SelectNodesDialog(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      //dialogConfig.disableClose = true;
      dialogConfig.width = "500px";
      dialogConfig.data=this.inputnodes;
      this.matDialog.open(EquiArbreForSelectMultiComponent, dialogConfig)
      .afterClosed().subscribe( res=> {

        if( res != undefined && res!=null  ){
        this.receptednodes=res;
        this.emit.emit(this.receptednodes);
        }
        });
  }

  Action(e){
    /*
    for (let i = 0; i < this.receptednodes.length; i++) {
     let id=this.receptednodes[i].data.id;
     if(id==e){
       console.log(this.receptednodes[i].data.name);
     }
    }
    */

    var index = this.receptednodes.findIndex(x => x.data.id==e);
    if (index > -1) {this.receptednodes.splice(index, 1);}
    this.emit.emit(this.receptednodes); // zedtha ki st7a99itha fil filter anomalies

   // console.log(this.receptednodes[0]);
  }


}