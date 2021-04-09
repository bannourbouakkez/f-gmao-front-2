import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import { OutilService } from '../../services/outil.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-mag-dump-utilisations',
  templateUrl: './mag-dump-utilisations.component.html',
  styleUrls: ['./mag-dump-utilisations.component.scss']
})
export class MagDumpUtilisationsComponent implements OnInit {

  @Input() utilisations:any[];
  //@Input() OutilID:number;
  @Input() ListeValueUtilisations:any[];
  @Output() ListeValueUtilisationsEmitted = new EventEmitter(); 
 
  ListeValueUtilisationsToEmitted=<any>[];
  Form:FormGroup;
  constructor(private outilService:OutilService,private fb:FormBuilder) { }

  ngOnInit() {
    this.Form=this.fb.group({ListeValueUtilisationsFormControl:['']});
    this.Form.patchValue({ListeValueUtilisationsFormControl:this.ListeValueUtilisations});
  }
  
  change(e) {
    this.ListeValueUtilisationsToEmitted=e;//.value;
    this.ListeValueUtilisationsEmitted.emit(this.ListeValueUtilisationsToEmitted);  // Déclenche l'output
  }

  openDialogAddUtilisation(){

  }

}
