import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MagBsoService } from '../../services/mag-bso.service';

@Component({
  selector: 'app-mag-use-aff',
  templateUrl: './mag-use-aff.component.html',
  styleUrls: ['./mag-use-aff.component.scss']
})
export class MagUseAffComponent implements OnInit {
  UseID:number=0;
  use:any;

  BsoID:number=0;
  bso:any;
  bso_dets=<any>[];
  response_bso:any;
  response_bso_dets=<any>[];
  combined=<any>[];
 
  loaded=false;

  constructor(private bsoService:MagBsoService,private _currentRoute: ActivatedRoute,private router:Router
     ,public dialogRef: MatDialogRef<MagUseAffComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
    ) { }

  ngOnInit() {
    var UseID = +this._currentRoute.snapshot.paramMap.get('id');
    if(!UseID){
      UseID=+this.data.UseID;
    }

    if(UseID>0){ this.UseID=UseID; this.getUse2(UseID); }
  }

  getUse2(UseID:number){
    this.bsoService.getUse2(UseID).then(
      res=>{

        console.log(res);
        
        this.use=res.use;

       // this.bso=res.bso;
        this.bso=res.bsoWithNullOtID;
        this.bso_dets=res.bso_dets;
        this.response_bso=res.response_bso;
        this.response_bso_dets=res.response_bso_dets;
        this.combined=res.combined;
        this.loaded=true;
        
      },
      err=>console.log(err)
    );
  }

/*
  getBsoWithResponse(BsoID:number){  
    this.bsoService.getBsoWithResponse(BsoID).then(
      res=>{
        console.log(res);
        if(res.bso.ot_id>0){
          this.router.navigate(['/']);
        }
        this.bso=res.bso;
        this.bso_dets=res.bso_dets;
        this.response_bso=res.response_bso;
        this.response_bso_dets=res.response_bso_dets;
        this.combined=res.combined;
        this.loaded=true;
        
      },
      err=>console.log(err)
    );
   }
*/


openGererBso(){
  this.dialogRef.close('openGererBso');
}

}
