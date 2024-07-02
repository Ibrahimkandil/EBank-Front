import {Component, HostListener, OnInit} from "@angular/core";
import {WalletDashboardService} from "../wallet-dashboard.service";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {
  datasources:any[] = [];
  originalData: any[] = [];
  totalpages:number=0;
  screenWidth!  : number;
  public currencies:any = {
    'USD':{
      icon:"fa fa-usd",
      fullname:"United States dollar",
      num:3.19,
      color:"text-emerald-500"
      },
      'EUR':{
        icon:"fa fa-eur",
        fullname:"Euro",
        num:3.27,
    color:"text-emerald-500"
      }, 'JPY':{
        icon:"fa fa-jpy",
        fullname:"yen japonais",
      num:4.16
      ,
    color:"text-emerald-500"
      }, 'GBP':{
        icon:"fa fa-gbp",
        fullname:"Livre sterling",
      num:-4.16
        ,
    color:"text-red-500"
      },
      'AUD':{
        icon:"fa fa-usd",
        fullname:"Dollar australien",
        num:0.32,
        color:"text-emerald-500"
      },
    'CAD':{
        icon:"fa fa-usd",
        fullname:"Dollar canadien",
      num:1.5,
      color:"text-emerald-500"
    },
    'CHF':{
        icon:"fa-solid fa-franc-sign",
        fullname:"Franc suisse",
      num:2.5,
      color:"text-emerald-500"
    }
    , 'CNY':{
        icon:"fa fa-cny",
        fullname:"Yuan chinois",
        num:3.5,
      color:"text-emerald-500"
    }, 'SEK':{
        icon:"fa fa-krw",
        fullname:"Couronne suédoise",
        num:3.56,
      color:"text-emerald-500"
    },
    'NZD':{
        icon:"fa fa-usd",
        fullname:"Dollar néo-zélandais",
        num:0.54,
      color:"text-emerald-500"
    }}



  index=0;
  constructor(private  walletDashboardService:WalletDashboardService, private snackBar: MatSnackBar,) {
    this.screenWidth = window.innerWidth;
    this.walletDashboardService.fetchWallets().subscribe((data: any) => {
      this.snackBar.open("Success", 'Error', {
        duration: 5000, // duration in milliseconds (optional)
      });
      if(data){
        this.originalData=data;
        this.processData(this.originalData);

      }
    }, (error: any) => {
    });

  }
  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }
  advance(){
    console.log("index",this.index)

    if(this.index==this.totalpages-1){
    this.index=0;
  }else{
    this.index=this.index+1;}
    console.log("index",this.index)
  }

  goback(){
    console.log("index",this.index)
    if(this.index==0){
      this.index=this.totalpages-1;
    }else{
      this.index=this.index-1;}
    console.log("index",this.index)
  }
  gothere(index:number){
    this.index=index;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.processData(this.originalData);
  }
  calculateElementsPerPage() {
    if (this.screenWidth > 1020) {
      return 4;
    } else {
      return 3;
    }
  }
  processData(data: any[]) {
    if (data && data.length > 0) {
      let totforindx = this.calculateElementsPerPage();
      let numRows = Math.ceil(data.length / totforindx);
      this.datasources = [];
      for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < totforindx; j++) {
          let dataIndex = i * totforindx + j;
          if (dataIndex < data.length) {
            row.push(data[dataIndex]);
          } else {
            break;
          }
        }
        this.datasources.push(row);
      }
      console.log("datasources", this.datasources);
      console.log("datasources length", this.datasources.length);
      this.totalpages = this.datasources.length;
    }
  }
}


