import { SFXLibrary, MusicLibrary } from './index.js';

const get = async (url) => {
   let response = await fetch(url);
   return await response.text();
}

let sfxl = SFXLibrary.parse((await get("https://geometrydashfiles.b-cdn.net/sfx/sfxlibrary.dat")));
console.log(sfxl.getContents().find(x => x.id === 10727))

let ml = MusicLibrary.parse((await get("https://geometrydashfiles.b-cdn.net/music/musiclibrary.dat")));
console.log(ml.getContents().find(x => x.id === 10001912))