import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ArticleService } from 'src/app/features/magasin/services/article.service';

@Component({
  selector: 'app-zorro-test',
  templateUrl: './zorro-test.component.html',
  styleUrls: ['./zorro-test.component.scss']

})
export class ZorroTestComponent implements OnInit {

  demoValue=3;
  formtest=new FormGroup({name:new FormControl('')});
  
  constructor(private fb: FormBuilder,private testService: ArticleService,
    ) { }

  ngOnInit() {   
    /*
    this.formtest = this.fb.group({
      name: ['']
    });
*/
  } 

  onSubmit(){
    console.log(this.formtest.value);
  }



  selectedValue = null;
  listOfOption=<any>[];
  nzFilterOption = () => true;
  isLoading=false;

  search(value: string): void {
    if(value){
    this.isLoading=true;
        this.testService.getArticleListSearch(value).then(
        data=>{
        console.log(data);
        //const listOfOption: <Array<{ value: string; text: string }> = >[];
        /*
        data.forEach(item => {
          listOfOption.push({
            ArticleID: item['ArticelID'],
            article: item[0]
          });
        });
        */
       this.listOfOption = data;
       this.isLoading=false;
      });
    }
  }



}


