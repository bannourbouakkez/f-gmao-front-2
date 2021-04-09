import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-oui-ou-non',
  templateUrl: './oui-ou-non.component.html',
  styleUrls: ['./oui-ou-non.component.scss']
})
export class OuiOuNonComponent{
  constructor(
    public dialogRef: MatDialogRef<OuiOuNonComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}
    
  oui(){this.dialogRef.close(1);}
  non(){this.dialogRef.close(0);}
}