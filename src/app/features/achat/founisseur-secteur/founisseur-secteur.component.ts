import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormGroup, Validators , FormBuilder } from '@angular/forms';
import { FournisseurService } from '../services/fournisseur.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef } from "@angular/material/dialog";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-founisseur-secteur',
  templateUrl: './founisseur-secteur.component.html',
  styleUrls: ['./founisseur-secteur.component.scss']
})
export class FounisseurSecteurComponent implements OnInit {

  constructor(private _fb:FormBuilder,private _fournisseursService:FournisseurService,private _router:Router,private _route: ActivatedRoute,
    public dialogRef: MatDialogRef<FounisseurSecteurComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }
  id:number;
  form:FormGroup;
  isValid=true;
  sub:any;

  ngOnDestroy() { this.sub.unsubscribe(); }
  ngOnInit() { this.onInitForm(); }

  onSubmit() {

    if(this.form.valid){
    this._fournisseursService.addoreditsecteur(this.form.value).then(
      res => { if(!this.data){this._router.navigate(['/achat/secteurs/all']);}else{this.close("fromSubmit");} },
      err => console.log('FounisseurSecteurComponent:onSubmit:' + err)
    )
    }else{
      this.isValid=false;
    }
  }

  onInitForm() {
    this.form = this._fb.group({ id: [''],secteur: ['', Validators.required],created_at: [''], updated_at: [''] });
    this.sub = this._route.params.subscribe(params => { this.id = +params['id']; });
    if (this.id) { this.getSecteur(this.id); }
  }

  

  getSecteur(id:number){
    this._fournisseursService.getSecteur(id).then(res => {
      this.form.setValue(res);
    })
  }
  
  close(from) { this.dialogRef.close(from); } //####################



}