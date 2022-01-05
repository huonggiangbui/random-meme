import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'random-meme-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();

  // constructor() { }
  ngOnInit() {
    return
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
