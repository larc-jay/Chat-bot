import { AfterViewChecked, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClientService } from '../service/http-client.service';
import { Message } from '../model/Message';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  @Output() submitUrl = new EventEmitter<any>();
  
  selectedLink : any ="";
  urls :any = [];
  isGenerate = false;
  constructor(
    private httpClient: HttpClientService,
  ) { 
    this.isGenerate =false;
  }
  ngOnInit() {
    this.setTempUrl();
    this.getAllUrl();
    this.isGenerate =false;
  }
  generateSummary(){
    this.isGenerate = true;
    let u = this.urls.find((ur:any)=>ur.url == this.selectedLink);
    this.submitUrl.emit(u)
  }
  getAllUrl(){
    this.httpClient.getAllUrl().subscribe(
      {
        next :(res)=>{
          this.urls = res
        }
      }
    )
  }
  reset(){
    this.urls = [];
    this.isGenerate = false;
    this.selectedLink ="";
    this.getAllUrl();
  }

  setTempUrl(){
    this.urls =[
      {
        name : 'url name 1',
        url : 'url link 1'
      },
      {
        name : 'url name 2',
        url : 'url link 2'
      },
      {
        name : 'url name 3',
        url : 'https://rukminim2.flixcart.com/image/416/416/k7285u80/washing-machine-new/x/t/t/ace-7-5-supreme-whirlpool-original-imafpdphxezg24ey.jpeg?q=70'
      }
    ];
  }
}
