import { Component, OnInit } from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-fournisseurs',
  templateUrl: './liste-fournisseurs.component.html',
  styleUrls: ['./liste-fournisseurs.component.scss']
})
export class ListeFournisseursComponent implements OnInit {

  fournisseurs=<any>[];
  constructor(private _fournisseursService:FournisseurService,private _router:Router) { }
  
  ngOnInit() {
    this.getFournisseurs();
  }

  getFournisseurs(){
    this._fournisseursService.getFournisseurs().then(res=>{  this.fournisseurs=res; })
  }

  edit(i){
    this._router.navigate(['/achat/fournisseurs/addoredit',i]);
  }


}
