import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dump-reason',
  templateUrl: './dump-reason.component.html',
  styleUrls: ['./dump-reason.component.scss']
})
export class DumpReasonComponent implements OnInit {

  
constructor(
  public dialogRef: MatDialogRef<DumpReasonComponent>,
  @Inject(MAT_DIALOG_DATA) public data) {}


onSubmit(message): void {
   let obj:any={};
   obj.envoyer=true;
   obj.message=message;
   this.dialogRef.close(obj); 
  }

close(){this.dialogRef.close('');}

annuler(){
  let obj:any={};
  obj.envoyer=false;
  this.dialogRef.close(obj);
}


  ngOnInit() {
  }

}



