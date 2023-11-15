import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientService } from '../service/http-client.service';
import { Message } from '../model/Message';
import { ChatService } from '../service/chat.service';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;
  @ViewChild(AboutComponent) about!: AboutComponent;
  constructor(
    private httpClient: HttpClientService,
    public chatService: ChatService
  ) { }
  selectedLink : any ="";
  selectedUrlName :any = "";
  question :any ="";
  summaryResult:any = {};
  result :any = {};
  urls :any = [];
  historyUrls :any = []
  generating = false;
  start: boolean = false
  messages: Message[] = [];
  counter1 = 0;
  counter2 = 0;
  MAXLEN1 =0;  
  MAXLEN2 =0;  
  minmax = false;
  messageBox = true;
  isGenerated = false;
  imgLink:any ="";
  thumbnail = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsWiHGWhvUts3ud-clad_6KDd3O1UNPx2yJL43wc_G6g&s"
  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 

  ngOnInit() {
    this.urls =[
      {
        search_term : 'url namewhere we turn user reviews into valuable insights. We transfo  ',
        product_url : 'url link 1 where we turn user reviews into valuable insights. We transfo'
      },
      {
        search_term : 'url nawhere we turn user reviews into valuable insights. We transfome 2 ',
        product_url : 'url link 2'
      },
      {
        search_term : 'url name 3',
        product_url : 'https://rukminim2.flixcart.com/image/416/416/k7285u80/washing-machine-new/x/t/t/ace-7-5-supreme-whirlpool-original-imafpdphxezg24ey.jpeg?q=70'
      }
    ];
    this.historyUrls = this.urls;
    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
    this.scrollToBottom();
    setTimeout(() => this.start = true, 1000)
  }
  scrollToBottom(): void {
    try {
      if(this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }                 
}
  sendTestMessage() {
    if(!this.question){
      return;
    }
    const query = {
      summary : this.summaryResult.response,
      question : this.question
    }
    this.minmax = true;
    this.chatService.setMessageAnswer(this.question,"Hello how are you")
    this.chatService.getBotAnswer(this.question);
    this.question = '';
    this.scrollToBottom();
  }
 
  sendMessage() {
    if(!this.question){
      return;
    }
    const query = {
      summary : this.summaryResult.response,
      question : this.question
    }
    this.minmax = true;
    this.httpClient.askQuestion(query).subscribe(
      {
        next : (res)=>{
          this.result = res;
          if(res){
            this.chatService.setMessageAnswer(this.question,res.answer)
            this.chatService.getBotAnswer(this.question);
            this.question = '';
            this.scrollToBottom();
          }
        },
        error :(err)=>{
          console.log(err)
        }
      }) 
  }
  generateSummary(){
     const query = {product_link : this.selectedLink}
     this.generating = true;
     this.summaryResult = {};
     this.httpClient.generateSummary(query).subscribe(
      {
        next : (res)=>{
          this.summaryResult = res;
            
          //for writing effect
          /*this.counter1 = 0;
          this.counter2 = 0;
          this.MAXLEN1 = this.summaryResult.responsePros.length;
          this.MAXLEN2 = this.summaryResult.responseCons.length;
          (document.getElementById("appCons")as any ).innerHTML='';
          (document.getElementById("appPros")as any ).innerHTML =''
          this.typeWriterPros(()=>{
            this.typeWriterCons()
          });
           */
           this.getAHistoryUrl();
          this.isGenerated = true;
          if(this.selectedUrlName && this.selectedUrlName.trim()){
            this.setGeneratedUrl();
          }
        },
        error :(err)=>{
          console.log(err);
          this.setTempSummary();
        }
      }
    )
  }
  typeWriterPros(callback:Function){
    if(this.counter1>= this.MAXLEN1 ){
      callback();
      return;
    }
      setTimeout(()=> {
          (document.getElementById("appPros")as any ).innerHTML += this.summaryResult.responsePros.charAt(this.counter1);
          this.counter1 = this.counter1 + 1;
          this.typeWriterPros(callback);
        } ,30);

  }

  typeWriterCons(){
    if(this.counter2>= this.MAXLEN2 ){
      return;
    }
      setTimeout(()=> {
          (document.getElementById("appCons")as any ).innerHTML += this.summaryResult.responseCons.charAt(this.counter2);
          this.counter2 = this.counter2 + 1;
          this.typeWriterCons();
        } ,30);
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
  getAHistoryUrl(){
    this.httpClient.getHistoryUrl().subscribe(
      {
        next :(res)=>{
          this.historyUrls = res.search_history
        }
      }
    )
  }
  setGeneratedUrl(){
    const query = {
      url:this.selectedLink,
      name : this.selectedUrlName,
      img_link : this.imgLink
    }
    this.httpClient.setHistoryUrl(query).subscribe(
      {
        next :(res)=>{
          console.log(res);
        }
      }
    )
  }
  generateHistoryUrlsSummary(url:any){
    this.selectedLink = url;
    this.selectedUrlName ="";
    this.generateSummary();
  }
  clearMessage(){
    this.messages = [];
    this.chatService.clearChat();
  }
  maximize(){
    this.minmax = !this.minmax ;
    if(this.minmax){
      this.messageBox = true;
      let style = document.querySelector(".message-box") as any;
      style.style.bottom = "115px";
      style.style.width = "79%";
    }else{
      this.messageBox = false;
      let style = document.querySelector(".message-box") as any;
      style.style.bottom = "35px";
      style.style.width = "50px";
    }
  }
  submit(event:any){
    this.selectedLink=event.url;
    this.selectedUrlName = event.name;
    this.imgLink = event.img_link
    this.generateSummary();
    this.generating = true;
    //this.setTempSummary();
    console.log(event.url)
  }
  close(){
    this.isGenerated = false;
    this.about.reset();
  }
  setTempSummary(){
    this.summaryResult =
          {
            "execution_time": "35.04087948799133 seconds",
            "img_url": "https://rukminim2.flixcart.com/image/416/416/k7285u80/washing-machine-new/x/t/t/ace-7-5-supreme-whirlpool-original-imafpdphxezg24ey.jpeg?q=70",
            "product_name": "Whirlpool 7.5 kg 5 Star, Ace Wash Station Semi Automatic Top Load Washing Machine Grey  (ACE 7.5 SUPREME GREY DAZZLE)",
            "rating": 4.4,
            "response":"test",
            "responsePros": "Performance: 70% of users were satisfied with the washingmachine's performance. They mentioned that it does the job well,especially considering its price point. * Build Quality: 60% of userswere satisfied with the build quality of the washing machine. Theynoted that while it may not be as sturdy as some other brands, it'sstill decent for the price. * Value for Money: 80% of users felt thatthe washing machine offered good value for money. They appreciated thebalance between performance and price.",
            "responseCons": "Noise: 30% of usersexperienced excessive noise during operation. They noted that it canget quite loud, especially during the spin cycle. * Plastic Quality:20% of users were disappointed with the quality of the plastic used inthe washing machine. They noted that it feels cheap and flimsycompared to other machines they have owned. * Shaking DuringOperation: 10% of users reported that their washing machine wouldshake excessively during operation. This could be due to improperbalancing or a weak frame.  Overall, the majority of users weresatisfied with their purchase, praising its performance and value formoney. However, some users experienced issues with noise and plasticquality, which may affect their overall satisfaction.",
            "responseConsList": [
              "Noise: 60% ofusers reported that the machine can be quite noisy during operation.",
              "Plastic quality: 40% of users felt that the plastic parts used in themachine could be of higher quality.",
              "Shaking during operation: 30% ofusers experienced some shaking during operation, which affected theiroverall experience."
          ],
          "responseProsList": [
              "Performance: 90% of users expressed satisfaction with themachine's performance. They praised its ability to wash clothesthoroughly and quickly.",
              "Build quality: 95% of users were satisfiedwith the build quality of the machine. They mentioned that it feelssolid and sturdy.",
              "Price-value ratio: 90% of users felt that themachine offers excellent value for money.",
              "Ease of use: 95% of usersfound the machine easy to use and operate."
          ]
          }
          /*
          this.counter1 = 0;
          this.counter2 = 0;
          this.MAXLEN1 = this.summaryResult.responsePros.length;
          this.MAXLEN2 = this.summaryResult.responseCons.length;
          (document.getElementById("appCons")as any ).innerHTML='';
          (document.getElementById("appPros")as any ).innerHTML =''
          this.typeWriterPros(()=>{
            this.typeWriterCons()
          });*/
          this.isGenerated = true;
  }
}
