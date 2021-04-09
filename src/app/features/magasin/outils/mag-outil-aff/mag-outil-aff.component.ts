import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OutilService } from '../../services/outil.service';

@Component({
  selector: 'app-mag-outil-aff',
  templateUrl: './mag-outil-aff.component.html',
  styleUrls: ['./mag-outil-aff.component.scss']
})
export class MagOutilAffComponent implements OnInit {
  
  outil:any;
  OutilID:number=0;
  ListeUtilisations=<any>[];
  constructor( private outilService:OutilService,private _currentRoute: ActivatedRoute) { }

  ngOnInit() {

    let OutilID = +this._currentRoute.snapshot.paramMap.get('id');
    if(OutilID>0){
      this.OutilID=OutilID;
      let source='affichage';
      this.outilService.getOutilAndTables(OutilID,source).then(
        res=>{
        this.ListeUtilisations=res.ListeUtilisations;
        this.outil=res.outil;
        },
        err=>console.log(err)
      );
      }
  }

  deleteOutil(){
    this.outilService.deleteOutil(this.OutilID).then(
      res=>console.log(res),
      err=>console.log(err)
    );
  }

}
