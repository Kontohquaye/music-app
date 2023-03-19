const image = document.querySelector(".container .image-section img");
const songTitle = document.querySelector(".container .song-info .title");
const songArtist = document.querySelector(".container .song-info .artist");
const audio = document.querySelector("audio");
// controls
const repeat = document.querySelector("#repeat");
const prev = document.querySelector("#previous");
const play = document.querySelector("#play");
const next = document.querySelector("#next");
const musicList = document.querySelector("#music-list");
const progress = document.querySelector(".progress-section");
const progressBar = document.querySelector(".progress-section .bar");
// library music
const library = document.querySelector(".music-library");
let currentSong;

let musicIndex = 1;
const loadApp = () => {
  if (musicIndex == 0) {
    musicIndex = 7;
  } else if (musicIndex > 7) {
    musicIndex = 1;
  }
  image.src = `images/${musicLibrary[musicIndex - 1].img}.jpg`;
  songTitle.textContent = musicLibrary[musicIndex - 1].name;
  songArtist.textContent = musicLibrary[musicIndex - 1].artist;
  audio.src = `songs/${musicLibrary[musicIndex - 1].src}.mp3`;
};

const playAudio = () => {
  play.classList.add("playing");
  updateLibrary();
  audio.play();
  play.innerHTML = "pause";
};

const pauseAudio = () => {
  play.classList.remove("playing");
  audio.pause();
  play.innerHTML = "play_arrow";
};

const playPause = () => {
  let playingMusic = play.classList.contains("playing");
  playingMusic ? pauseAudio() : playAudio();
};

const nextMusic = () => {
  musicIndex++;
  loadApp();
  playAudio();
};

const prevMusic = () => {
  musicIndex--;
  loadApp();
  playAudio();
};

const repeatMusic = () => {
  let currentbtn = repeat.innerText;
  switch (currentbtn) {
    case "repeat":
      repeat.innerText = "repeat_one";
      break;
    case "repeat_one":
      repeat.innerText = "shuffle";
      break;

    default:
      repeat.innerText = "repeat";
      break;
  }
};

audio.addEventListener("ended", () => {
  if (repeat.innerText == "repeat_one") {
    audio.currentTime = 0;
    playAudio();
  } else if (repeat.innerText == "repeat") {
    nextMusic();
  } else if (repeat.innerText == "shuffle") {
    let newMusicIndex = Math.floor(Math.random() * musicLibrary.length) + 1;
    // if the value of musicindex = newmusicIndex;
    do {
      newMusicIndex = Math.floor(Math.random() * musicLibrary.length) + 1;
    } while (musicIndex == newMusicIndex);
    musicIndex = newMusicIndex;
    loadApp();
    playAudio();
  }
});

const displayLibrary = () => {
  library.classList.add("active");
  library.querySelector("#cancel").addEventListener("click", () => {
    library.classList.remove("active");
  });
};

// import here
import { musicLibrary } from "./library.js";
for (let i = 0; i < musicLibrary.length; i++) {
  let list = `<li index="${i + 1}" >
                <img src="images/${musicLibrary[i].img}.jpg" alt="">
                <div class="info">
                    <span class="title">${musicLibrary[i].name}</span>
                    <div class="artist">${musicLibrary[i].artist}</div>
                </div>
                <audio id="${musicLibrary[i].src}" src="songs/${
    musicLibrary[i].src
  }.mp3"></audio>
                <div class="duration">--</div>
              </li>`;

  library.querySelector("ul").insertAdjacentHTML("beforeend", list);

  let audioTag = library.querySelector(`#${musicLibrary[i].src}`);
  audioTag.addEventListener("loadeddata", () => {
    let duration = audioTag.duration;
    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    if (sec < 10) {
      sec = `0${sec}`;
    }
    library.querySelectorAll(".duration")[i].textContent = `${min}: ${sec}`;
  });
}
// list functionality
let libraryList = library.querySelectorAll("li");

libraryList.forEach((list, index) => {
  list.addEventListener("click", () => {
    libraryList.forEach((e) => {
      e.classList.remove("playing");
    });
    list.classList.add("playing");
    musicIndex = index + 1; //because the index starts from 0
    loadApp();
    playAudio();
  });
});

const updateLibrary = () => {
  libraryList.forEach((list) => {
    list.classList.remove("playing");
    libraryList[musicIndex - 1].classList.add("playing");
  });
};

// lets avoid error
audio.addEventListener("loadeddata", () => {
  let duration = audio.duration;
  const endTime = document.querySelector(".counter .max");
  let min = Math.floor(duration / 60);
  let sec = Math.floor(duration % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  endTime.textContent = `${min}:${sec}`;
});

audio.addEventListener("timeupdate", (e) => {
  let currentTime = e.target.currentTime;
  const currentPlayTime = document.querySelector(".counter .min");
  let min = Math.floor(currentTime / 60);
  let sec = Math.floor(currentTime % 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }
  currentPlayTime.textContent = `${min}:${sec}`;
  progressBar.style.width = `${(currentTime / audio.duration) * 100}%`;
});

progress.addEventListener("click", (e) => {
  let offsetWidth = e.offsetX;
  let progressWidth = progress.clientWidth;
  progressBar.style.width = `${(offsetWidth / progressWidth) * 100}%`;
  audio.currentTime = (e.offsetX / progress.clientWidth) * audio.duration;
  playAudio();
});

// lastly..lets work on some keyboard keys
window.addEventListener("keypress", (e) => {
  if (e.key == " ") {
    playPause();
  } else if (e.key == "p") {
    prevMusic();
  } else if (e.key == "n") {
    nextMusic();
  }
});

musicList.addEventListener("click", displayLibrary);
repeat.addEventListener("click", repeatMusic);
prev.addEventListener("click", prevMusic);
next.addEventListener("click", nextMusic);
play.addEventListener("click", playPause);
window.addEventListener("load", loadApp);
