import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EquipementService } from '../../../services/equipement.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-comp',
  templateUrl: './edit-comp.component.html',
  styleUrls: ['./edit-comp.component.scss']
})
export class EditCompComponent implements OnInit {

  EquipementID:number=0;
  formEquipement:FormGroup;
  allData:any={};
  constructor(public dialogRef: MatDialogRef<EditCompComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data
             ,private equipementService:EquipementService,private fb: FormBuilder) { }

ngOnInit() {
  //this.EquipementID=this.NodesArrToIdsArr(this.data.EquipementID);
  //let EquipementID=this.data.EquipementID;
  //console.log(this.data);
  this.InitForm();
  //console.log(this.data.EquipementID);
  this.getAllDetEquipement(this.data);
}

getAllDetEquipement(EquipementID:number){
    this.equipementService.getAllDetEquipement(EquipementID).then(
      res => {
        console.log(res.equipement);
        this.EquipementID=EquipementID;
        this.formEquipement.patchValue(res.equipement);
        },
      err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
     );
}

InitForm(){
  this.formEquipement = this.fb.group({
    EquipementID: [''],
    equipement: [''],
    isMarche:[''],
    mise_en_service: [''],
    prixTTC: [''],
    dossier_id: [1]
});
}


onSubmit(){
  this.equipementService.editEquipement(this.EquipementID,this.formEquipement.value).then(
    res1 => {
        //if(typeof this.allData.EquipementID !== 'undefined'){
        if(this.allData.EquipementID){
        this.equipementService.AddOrEditEquipementArticle(this.allData.EquipementID,this.allData.formData,this.allData.articlesMagasin,this.allData.articlesAtelier).then(
        res2 => {
          this.dialogRef.close(res1);
        })
        }else{
          this.dialogRef.close(res1);
        }
      },
    err => console.log(err)
   );

}

//Envoyer(){
  //let tab=this.IdsArrToNodesArr(this.selectedIds)
  //this.dialogRef.close(tab);
//}


getData(data:any){
 this.allData=data;
}


}
