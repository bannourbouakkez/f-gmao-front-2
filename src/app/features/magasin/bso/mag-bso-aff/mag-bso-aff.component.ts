import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mag-bso-aff',
  templateUrl: './mag-bso-aff.component.html',
  styleUrls: ['./mag-bso-aff.component.scss']
})
export class MagBsoAffComponent implements OnInit {
  // el page hethi kén lel magasinier 
  BsoID:number=0;
  Src='correctif';
  isCorrectif=true;
  isData=true;
  
  constructor(private _currentRoute: ActivatedRoute
    ,public dialogRef: MatDialogRef<MagBsoAffComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data

    ) { }

  ngOnInit() {
    var BsoID = +this._currentRoute.snapshot.paramMap.get('id');
    var Src = this._currentRoute.snapshot.paramMap.get('Src');

    if(!BsoID){
      BsoID=this.data.BsoID;
      Src=this.data.Src;
      //this.isData=true;
    }

    if(Src=='preventif'){this.Src='preventif'; this.isCorrectif=false;}
    if(BsoID>0){ this.BsoID=BsoID; }
  }

}
