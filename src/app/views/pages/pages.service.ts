import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  loading = true;

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle(loading) {
    this.loading = loading
    this.change.emit(this.loading)
  }

  constructor() { }
}
