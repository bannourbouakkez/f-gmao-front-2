import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {Observable, of} from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ArticleService } from 'src/app/features/magasin/services/article.service';

interface IServerResponse {
    items: string[];
    total: number;
}

@Component({
  selector: 'app-cmd-liste-retour-corb',
  templateUrl: './cmd-liste-retour-corb.component.html',
  styleUrls: ['./cmd-liste-retour-corb.component.scss']
})
export class CmdListeRetourCorbComponent implements OnInit {
 
  // https://www.npmjs.com/package/ngx-pagination
  constructor(private articleService:ArticleService) { }

   asyncMeals: Observable<any[]>;
   p: number = 1; total: number; itemsPerPage=10; loading: boolean;
   
   ngOnInit() {
       this.getPage(1);
   }

   getPage(page: number) {
       this.loading = true;
        this.asyncMeals = this.articleService.getArticlesPerPage(this.itemsPerPage,page)
        .pipe(
           tap(res => {
               this.total = res.total;
               this.p = page;
               this.loading = false;
               console.log(res.test);
               console.log(res.items);
           }),
           map(res => res.items)
       );
   }

   
incrementsItemsPerPage(e){
  this.itemsPerPage=e.target.value;
  this.getPage(1);
}


}
