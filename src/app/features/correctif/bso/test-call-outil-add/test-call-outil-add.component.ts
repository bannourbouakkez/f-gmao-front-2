import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CorrBsoAddComponent } from '../corr-bso-add/corr-bso-add.component';
import { BsooService } from '../../services/bsoo.service';
 
@Component({
  selector: 'app-test-call-outil-add',
  templateUrl: './test-call-outil-add.component.html',
  styleUrls: ['./test-call-outil-add.component.scss']
})
export class TestCallOutilAddComponent implements OnInit {
  
  bsos=<any>[];
  OtID=5;

  constructor(private dialog: MatDialog,private bsoService:BsooService) { }

  ngOnInit() {
    this.getBsos(this.OtID);
  }

  AddOrEditBso(OtID:number,BsoID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "80%";
    dialogConfig.data = { OtID,BsoID }; 
    this.dialog.open(CorrBsoAddComponent, dialogConfig).afterClosed().subscribe(res => {
     // if(res=='again' && DaArticleIndex==null){this.AddOrEditDaArticle(DaArticleIndex, id); }
     // console.log(res);
     
     if(res != undefined && res != null){
        if(res.BsoID>0){this.bsos.push(res);}
        if(res==true){ console.log('modification c bon ');}
      }
     
    });
  }

  getBsos(OtID:number){
    /* el page héthi kol aslha zayda w wfonction héthi zayda mani fassa5tha 
    this.bsoService.getBsos(OtID).then(
      res=>{
        this.bsos=res; 
        //console.log(res);
      },
      err=>console.log(err)
    );
    */
  }

  
}