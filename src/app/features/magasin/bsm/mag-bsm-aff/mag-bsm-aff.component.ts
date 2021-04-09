import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mag-bsm-aff',
  templateUrl: './mag-bsm-aff.component.html',
  styleUrls: ['./mag-bsm-aff.component.scss']
})
export class MagBsmAffComponent implements OnInit {
// el page hethi kén lel magasinier 
BsmID:number=0;
Src='correctif';
isCorrectif=true;
//isData=false;
constructor(private _currentRoute: ActivatedRoute
           ,public dialogRef: MatDialogRef<MagBsmAffComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) { }

ngOnInit(){
  var BsmID = +this._currentRoute.snapshot.paramMap.get('id');
  var Src = this._currentRoute.snapshot.paramMap.get('Src');


  if(!BsmID){
    BsmID=this.data.BsmID;
    Src=this.data.Src;
    //this.isData=true;
  }
  
  if(Src=='preventif'){this.Src='preventif'; this.isCorrectif=false;}
  if(BsmID>0){ this.BsmID=BsmID; }
}



}
