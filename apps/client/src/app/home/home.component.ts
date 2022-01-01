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
  defaultMeme: any = {};

  constructor(private homeService: HomeService) { }

  async ngOnInit() {
    await this.getMemes();
  }
  
  async getMemes(): Promise<void> {
    await this.homeService.getMemes()
    .subscribe(memes => {
      this.memes = memes;
      this.randomizeMemes();
    });
  }

  async randomizeMemes(): Promise<void> {
    const numOfMemes = this.memes.length
    const ran_index = Math.floor(Math.random() * numOfMemes)
    this.defaultMeme = this.memes[ran_index]
  }
}
