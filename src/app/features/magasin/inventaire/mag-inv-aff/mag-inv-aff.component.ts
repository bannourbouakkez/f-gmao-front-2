import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventaireService } from '../../services/inventaire.service';

@Component({
  selector: 'app-mag-inv-aff',
  templateUrl: './mag-inv-aff.component.html',
  styleUrls: ['./mag-inv-aff.component.scss']
})
export class MagInvAffComponent implements OnInit {

  inventaire:any;
  inventaireDet=<any>[];
  intervenants=<any>[];
  InventaireID:number;
  Loaded=false;
  constructor(private _currentRoute: ActivatedRoute,private inventaireService:InventaireService) { }

  ngOnInit(){
    let InventaireID = +this._currentRoute.snapshot.paramMap.get('id');
    if(InventaireID>0){
    this.InventaireID=InventaireID;
    this.getInventaire(InventaireID);
    }
  }
  
  getInventaire(InventaireID:number){
   this.inventaireService.getInventaire(InventaireID).then(
     res=>{
       this.Loaded=true;
       this.inventaire=res.inventaire;
       this.inventaireDet=res.inventaireDet;
       this.intervenants=res.intervenants;
    },
     err=>console.log(err)
   );
  }


  correction(){
    this.inventaireService.correction(this.InventaireID).then(
      res=>console.log(res),
      err=>console.log(err)
    );
  }
  


}
