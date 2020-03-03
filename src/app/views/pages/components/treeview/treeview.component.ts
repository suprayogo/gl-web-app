import { Component, OnInit, Input, ChangeDetectionStrategy, AfterContentInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kt-treeview',
  templateUrl: './treeview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./treeview.component.scss']
})
export class TreeviewComponent implements OnInit, AfterContentInit {

  @Input() title: string;
  @Input() idata: any[];
  @Input() indicator: string;
  @Input() indicatorValue: string;
  @Input() subIndicator: string;
  @Input() rowOf: number;
  @Input() header: any[];
  @Input() sortBy: string;
  @Input() enableMinHeight: boolean;
  @Output() selectRowEvent = new EventEmitter();

  //Variables
  data: any[];
  in: string;
  inV: string;
  sin: string;
  nRowOf: number;
  headerView: any[];
  sBy: string;
  openned = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.data = this.idata
    this.in = this.indicator
    this.inV = this.indicatorValue
    this.sin = this.subIndicator
    this.nRowOf = this.rowOf + 1
    this.headerView = this.header
    this.sBy = this.sortBy
  }

  open(index){
    let founded = false, foundedI = null;
    for(var i=0;i<this.openned.length;i++){
      if(this.openned[i] == index) {
        founded = true
        foundedI = i
        break;
      }
    }

    if(founded){
      this.openned.splice(foundedI,1)
    }else{
      this.openned.push(index)
    }
  }

  isOpen(index){
    let founded = false;
    for(var i=0;i<this.openned.length;i++){
      if(this.openned[i] == index) {
        founded = true
        break;
      }
    }
    return founded
  }

  setMaintree(){
    let maintree = [];
    for(var i = 0; i<this.data.length; i++){
      if(this.data[i][this.in] === this.inV){
        maintree.push(this.data[i])
      }
    }

    let temp = maintree, x = this.sBy
    temp.sort(function(a, b) {
      const tempa = a[x];
      const tempb = b[x];
      let comparison = 0;
      if (tempa > tempb) {
        comparison = 1;
      } else if (tempa < tempb) {
        comparison = -1;
      }
      return comparison
    })

    return temp

  }

  getSubtree(maintree){
    let hasSub = false
    for(var i=0; i<this.data.length; i++){
      if(this.data[i][this.in] === maintree){
        hasSub = true
        break
      }
    }

    return hasSub
  }

  onRowClicked(rowData){
    this.selectRowEvent.emit(rowData)
  }

  numberFormatter(amount, decimalCount = 0, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i: any = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {

    }
  }

}