import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CorrBsmAddComponent } from '../corr-bsm-add/corr-bsm-add.component';
import { BsmService } from '../../services/bsm.service';

@Component({
  selector: 'app-test-call-bsm-add',
  templateUrl: './test-call-bsm-add.component.html',
  styleUrls: ['./test-call-bsm-add.component.scss']
})
export class TestCallBsmAddComponent implements OnInit {

  bsms=<any>[];
  OtID=5;
  constructor(private dialog: MatDialog,private bsmService:BsmService) { }

  ngOnInit() {
    this.getBsms(this.OtID);
  }

  AddOrEditBsm(OtID:number,BsmID:number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    //dialogConfig.disableClose = true;
    dialogConfig.width = "80%";
    dialogConfig.data = { OtID,BsmID }; 
    this.dialog.open(CorrBsmAddComponent, dialogConfig).afterClosed().subscribe(res => {
     // if(res=='again' && DaArticleIndex==null){this.AddOrEditDaArticle(DaArticleIndex, id); }
     // console.log(res);
     
     if(res != undefined && res != null){
        if(res.BsmID>0){this.bsms.push(res);}
        if(res==true){console.log('modification c bon ');}
      }
     
    });
  }

  getBsms(OtID:number){
    this.bsmService.getBsms(OtID).then(
      res=>{
        this.bsms=res; 
        //console.log(res);
      },
      err=>console.log(err)
    );
  }

}