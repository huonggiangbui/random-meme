import axios from "axios";
import * as RedditImageFetcher from 'reddit-image-fetcher';
import { Meme } from "./meme.entity";

export async function getMemeFetcher(): Promise<void | Meme[]> {
  const memes = []
  await RedditImageFetcher.fetch({
    type: 'meme',
    total: 50
  }).then(result => {
    for (let i = 0; i < result.length; i++) {
      const rawResult = result[i];
      const meme = {
        source: rawResult.image,
        content: rawResult.title,
      }; 
      memes.push(meme);
    }
  })
  .catch(err => console.error(err));
  return memes;
};

// fetch 50 memes by adding two subreddits and removing 1 subreddit from default subreddit library
// RedditImageFetcher.fetch({
//   type: 'custom',
//   total: 50,
//   addSubreddit: ['memes', 'funny'],
//   removeSubreddit: ['dankmemes']
// }).then(result => {
//   console.log(result);
// });

export async function getRedditMemes(): Promise < void | Meme[] > {
  const memes = []
  await axios
    .get(' https://meme-api.herokuapp.com/gimme/50')
    .then((res) => {
      const result = res.data.memes;
      for (let i = 0; i < result.length; i++) {
        const rawResult = result[i];
        const meme = {
          source: rawResult.url,
          content: rawResult.title,
        };
        memes.push(meme);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return memes
}