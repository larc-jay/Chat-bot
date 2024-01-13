import { AfterViewChecked, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClientService } from '../service/http-client.service';
import { Message } from '../model/Message';
import { interval } from 'rxjs';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  @Output() submitUrl = new EventEmitter<any>();
  observable = interval(5000);
  subscription :any;;
  selectedLink : any = {};
  urls :any = [];
  isGenerate = false;
  url:any = "";
  thumbnail = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWiHGWhvUts3ud-clad_6KDd3O1UNPx2yJL43wc_G6g&s"
  showUrl=false;
  
  sliderLength = 5;
  minSliderLength = 4;
  sliderStart=0;
  viewThumbnail :any= [];
  thumbnails:any = [];
  isSearchItem = false;
  isOnlineStore = false;
  isOnlineStoreInput = false;
  constructor(
    private httpClient: HttpClientService,
  ) { 
    this.isGenerate =false;
  }
  ngOnInit() {
    this.carousel();
    this.setTempUrl();
    this.generateThumbnail();
    this.getAllUrl();
    this.isGenerate =false;
    this.subscription = this.observable.subscribe(a=> this.carousel());
  }
  ngDestroy() {
    this.subscription.unsubscribe();
  }
  generateSummary(){
    this.isGenerate = true;
    //let u = this.urls.find((ur:any)=>ur.url == this.selectedLink);
    if(this.url){
      this.selectedLink.option='URL';
      this.selectedLink.url = this.url;
    }else{
      this.selectedLink.option='PROD'
    }
    this.submitUrl.emit(this.selectedLink)
    //this.url='';
  }
  getAllUrl(){
    this.httpClient.getHistoryUrl().subscribe(
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
    this.selectedLink = {};
    this.isSearchItem = false;
    this.isOnlineStore = false;
    this.isOnlineStoreInput = false;
    this.setTempUrl();
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
  generateThumbnail(){
    this.thumbnails =[
      {
        "icon":"https://cdn2.iconfinder.com/data/icons/social-icons-color/512/flipkart-512.png",
        "url" :"https://www.flipkart.com/"
      },
      {
        "icon":"https://blog.myntra.com/wp-content/themes/myntra/assets/img/Myntra-logo-horizontal.png",
        "url" :"https://www.myntra.com/"
      },
      {
        "icon":"https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png",
        "url" :"https://www.amazon.com/"
      },
      {
        "icon":"https://upload.wikimedia.org/wikipedia/en/3/35/Snapdeal_Logo_new.png?20160910142018",
        "url" :"https://www.snapdeal.com/"
      },
      {
        "icon":"https://assets.ajio.com/static/img/Ajio-Logo.svg",
        "url" :"https://www.ajio.com/"
      }
    ]
  }
  showUrls(){
    this.showUrl = !this.showUrl;
  }
  selectUrl(u:any){
    this.showUrl = false;
    this.selectedLink = u;
    if(u && !u.img_link){
      this.selectedLink.img_link = this.thumbnail;
    }
  }
  carousel(){
    this.sliderStart = this.sliderStart + 1;
    if((this.sliderStart + this.minSliderLength) > (this.sliderLength)){
      this.sliderStart = 0;
    }
    let entIndex = this.minSliderLength + this.sliderStart;
    this.viewThumbnail =  this.thumbnails.slice(this.sliderStart,entIndex)
    // let items = document.querySelectorAll('.carousel .carousel-item')
    // console.log(items.length)
    //   const minPerSlide = 4
    //   items.forEach((el) => {
    //       let next = el.nextElementSibling
    //       for (var i=1; i<minPerSlide; i++) {
    //           if (!next) {
    //               // wrap carousel by using first child
    //             next = items[0]
    //           }
    //           let cloneChild = next.cloneNode(true) as any;
    //           el.appendChild(cloneChild.children[0])
    //           next = next.nextElementSibling
    //       }
    //   })

  }
  next(){
    this.sliderStart = this.sliderStart + 1;
    if((this.sliderStart + this.minSliderLength) > (this.sliderLength)){
      this.sliderStart = 0;
    }
    let entIndex = this.minSliderLength + this.sliderStart;
    this.viewThumbnail =  this.thumbnails.slice(this.sliderStart,entIndex)
  }
  prev(){
   this.next();
  }
  searchItem(){
    this.isSearchItem = !this.isSearchItem;
    this.isOnlineStore =false;
    this.isOnlineStoreInput =false;
  }
  searchOnlineStore(){
    this.isOnlineStore = !this.isOnlineStore;
    this.isSearchItem =false;
    this.isOnlineStoreInput =false;
  }
  selectIconUrl(url:any){
    this.url = url.url;
    this.isOnlineStore = false;
    this.isOnlineStoreInput =true;
  }
}
