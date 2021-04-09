import { Component, OnInit,EventEmitter, Output, Input} from '@angular/core';
import { EditDateComponent } from '../edit-date/edit-date.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-editable-date',
  templateUrl: './editable-date.component.html',
  styleUrls: ['./editable-date.component.scss']
})
export class EditableDateComponent implements OnInit {

  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @Input() id:number;  
  @Input() date:string;  
  @Input() whattoedit:string;

  mon_date:string;
  loading=false;

  constructor(private dialog: MatDialog,private globalService:GlobalService) { }

  ngOnInit() {
    this.mon_date=this.date;
  }

  
  EditDate(date:string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "25%";
    dialogConfig.data = { date }; 
    this.dialog.open(EditDateComponent, dialogConfig).afterClosed().subscribe(res => {
     if(res != undefined && res != null){

       
       this.ModificationDate(res);
       

      }
    });
  }
  
  ModificationDate(date){
    this.loading=true;
    if(this.whattoedit=='otp_date_execution'){
      this.globalService.ModificationDate(this.id,this.whattoedit,date).then(
        res=>{
          this.loading=false;
          if(res.success){this.mon_date=res.date;}
          else{console.log('error');}
        },
        err=>console.log('err')
      );
    }

  

  }
 

  //Action(date){this.action.emit(date);}

}
