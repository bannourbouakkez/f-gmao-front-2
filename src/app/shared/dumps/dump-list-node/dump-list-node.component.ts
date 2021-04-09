import { Component, OnInit , EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-dump-list-node',
  templateUrl: './dump-list-node.component.html',
  styleUrls: ['./dump-list-node.component.scss']
})
export class DumpListNodeComponent implements OnInit {

  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  @Input() elements:[];
  @Input() x:boolean;
  constructor() { }
  
  ngOnInit() {
  }

  Action(e){this.action.emit(e);}


}
