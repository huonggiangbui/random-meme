import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'random-meme-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor() { }

  ngOnInit() {
    return
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}