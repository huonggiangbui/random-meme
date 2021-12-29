import { Component, OnInit } from '@angular/core';
import { Meme } from '@random-meme/shared-types';
import { HomeService } from './home.service';

@Component({
  selector: 'random-meme-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService]
})
export class HomeComponent implements OnInit {
  memes: Meme[] = [];

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.getHeroes();
  }
  
  getHeroes(): void {
    this.homeService.getMemes()
    .subscribe(memes => (this.memes = memes));
    console.log(this.memes)
  }
}
