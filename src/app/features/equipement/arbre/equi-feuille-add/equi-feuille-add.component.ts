import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipementService } from '../../services/equipement.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-equi-feuille-add',
  templateUrl: './equi-feuille-add.component.html',
  styleUrls: ['./equi-feuille-add.component.scss']
})
export class EquiFeuilleAddComponent implements OnInit {
 
  constructor(
    private _fb:FormBuilder,private equipementService:EquipementService,
   // private _router:Router,private _route: ActivatedRoute,
    public dialogRef: MatDialogRef<EquiFeuilleAddComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  Loaded=false;
  form:FormGroup;
  ParentID:number;
  nom:any;

  ngOnInit() {
    this.ParentID=this.data;
    this.onInitForm();
    
    this.equipementService.getNodeDet(this.ParentID).then(
      res=>{
        console.log(res);
        if(res != false){
        this.Loaded=true; 
        this.nom=res.NextNiveauName;
        }
      },
      err=>console.log(err)
    );
    

  }


  onInitForm() {
    this.form = this._fb.group({id:'',name:['', Validators.required]});
  }

  close(name) { this.dialogRef.close(name); }

  onSubmit() {
    //console.log(this.form.value);

  if(this.form.valid){
    this.equipementService.addEquipement(this.ParentID,this.form.controls['name'].value).then(
      res => { 
       // console.log(res);
        //if(!this.data){this._router.navigate(['/achat/modes/all']);}else{this.close("fromSubmit");}  },
       this.form.patchValue({id:res});
       if(res){this.close(this.form.value);}
       else{this.close(false)}
    },
       err => console.log('EquiFeuilleAddComponent:onSubmit:' + err)
    );
    }else{
      console.log('Name Required');
    }

  }




}
