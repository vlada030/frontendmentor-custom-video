const videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("#video");
const videoControls = document.querySelector("#videoControls");
const playpause = document.getElementById("playpause");
const stop = document.getElementById("stop");
const mute = document.getElementById("mute");
const volinc = document.getElementById("volinc");
const voldec = document.getElementById("voldec");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar"); // za browsere koji ne prikazu progress tag
const fullscreen = document.getElementById("fs");

// proveri da li browser podrzava video tag i u zavisnosti od toga omoguci ili disable custom controls
const isVideoSupported = !!document.createElement("video").canPlayType;

if (isVideoSupported) {
    video.controls = false;
    videoControls.style.display = "block";
}

// Media API properties - muted, ended, paused, currentTime, volume, duration
// events related to HTML 5 video tag - play, pause, loadedmetadata, timeupdate

playpause.addEventListener("click", () => {
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
});

stop.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    progress.value = 0;
});

mute.addEventListener("click", () => {
    video.muted = !video.muted;
});

volinc.addEventListener("click", function (e) {
    alterVolume("+");
});

voldec.addEventListener("click", function (e) {
    alterVolume("-");
});

const alterVolume = (dir) => {
    var currentVolume = Math.floor(video.volume * 10) / 10;

    if (dir === "+") {
        if (currentVolume < 1) video.volume += 0.1;
    } else if (dir === "-") {
        if (currentVolume > 0) video.volume -= 0.1;
    }
};

// progress elmnt ima max atribut (trajanje klipa), value atribut - trenutna vrednost
// FF zuri i ne ucita duration dok CHROME stigne da ucita
video.addEventListener("loadedmetadata", function () {
    progress.setAttribute("max", video.duration);
});
// sa svakim frejmom video okida se ovaj event
video.addEventListener("timeupdate", () => {
    // ukoliko nema max atributa, ovde mora da bude ucitan
    if (!progress.getAttribute("max")) {
        progress.setAttribute("max", video.duration);
    }

    progress.setAttribute("value", video.currentTime);
    progressBar.style.width =
        Math.floor((video.currentTime / video.duration) * 100) + "%";
});

// klik na progress bar za seeking
progress.addEventListener("click", function (e) {
    var rect = this.getBoundingClientRect();
    console.log(rect);
    var pos = (e.pageX - rect.left) / this.offsetWidth;
    video.currentTime = pos * video.duration;
    //progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + "%";
});

// FULLSCREEN MODE
const fullScreenEnabled = !!(
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled ||
    document.webkitSupportsFullscreen ||
    document.webkitFullscreenEnabled ||
    document.createElement("video").webkitRequestFullScreen
);

if (!fullScreenEnabled) {
    fullscreen.style.display = 'none';
 }
 