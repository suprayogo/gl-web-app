import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kt-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  @Input() loadingText: any;
  @Input() noText: boolean;

  constructor() { }

  ngOnInit() {
  }

}
