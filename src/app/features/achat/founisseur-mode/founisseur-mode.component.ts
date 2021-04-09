import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormGroup, Validators , FormBuilder } from '@angular/forms';
import { FournisseurService } from '../services/fournisseur.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef } from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";


@Component({
  selector: 'app-founisseur-mode',
  templateUrl: './founisseur-mode.component.html',
  styleUrls: ['./founisseur-mode.component.scss']
})
export class FounisseurModeComponent implements OnInit {

  constructor(private _fb:FormBuilder,private _fournisseursService:FournisseurService,
    private _router:Router,private _route: ActivatedRoute,
    public dialogRef: MatDialogRef<FounisseurModeComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) { }

  id:number;
  form:FormGroup;
  isValid=true;
  sub:any;
  ngOnDestroy() { this.sub.unsubscribe(); }
  ngOnInit() { this.onInitForm(); console.log(this.data)}

  onSubmit() {

    if(this.form.valid){
    this._fournisseursService.addoreditmode(this.form.value).then(
      res => { if(!this.data){this._router.navigate(['/achat/modes/all']);}else{this.close("fromSubmit");}  },
      err => console.log('FounisseurModeComponent:onSubmit:' + err)
    )
    }else{
      this.isValid=false;
    }
  }

  onInitForm() {
    this.form = this._fb.group({ id: [''],mode: ['', Validators.required],created_at: [''], updated_at: [''] });
    this.sub = this._route.params.subscribe(params => { this.id = +params['id']; });
    if (this.id) { this.getMode(this.id); }
  }

  getMode(id:number){
    this._fournisseursService.getMode(id).then(res => {
      this.form.setValue(res);
    })
  }
  
  close(from) { this.dialogRef.close(from); } //####################


}
