// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player

const videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("#video");
const videoControls = document.querySelector("#videoControls");
const playpause = document.getElementById("playpause");
const rewind = document.getElementById("rewind");
const forward = document.getElementById("forward");
const stop = document.getElementById("stop");
const mute = document.getElementById("mute");
const volinc = document.getElementById("volinc");
const voldec = document.getElementById("voldec");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar"); // za browsere koji ne prikazu progress tag
const fullscreen = document.getElementById("fs");

const svgPlay = document.getElementById("svgPlay");
const svgPause = document.getElementById("svgPause");
const svgMute = document.getElementById("svgMute");
const svgUnmute = document.getElementById("svgUnmute");
const svgExitFS = document.getElementById("svgExitFS");
const svgEnterFS = document.getElementById("svgEnterFS");

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
        svgPlay.classList.toggle("disabled", true);
        svgPause.classList.toggle("disabled", false);
    } else {
        video.pause();
        svgPlay.classList.toggle("disabled", false);
        svgPause.classList.toggle("disabled", true);
    }
});

stop.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    progress.value = 0;
    svgPlay.classList.toggle("disabled", false);
    svgPause.classList.toggle("disabled", true);
});

mute.addEventListener("click", () => {
    video.muted = !video.muted;
    svgMute.classList.toggle("disabled");
    svgUnmute.classList.toggle("disabled");
    // if (video.muted) {
    //     svgMute.classList.toggle('disabled', false)
    //     svgUnmute.classList.toggle('disabled', true)
    // } else {
    //     svgMute.classList.toggle('disabled', true)
    //     svgUnmute.classList.toggle('disabled', false)
    // }
});

volinc.addEventListener("click", () => {
    if (video.muted) return;
    console.log(video.volume);
    alterVolume("+");

    if (video.volume > 0.1 && !video.muted) {
        svgMute.classList.toggle("disabled", true);
        svgUnmute.classList.toggle("disabled", false);
    }
});

voldec.addEventListener("click", () => {
    if (video.muted) return;
    console.log(video.volume);
    alterVolume("-");

    if (video.volume < 0.1) {
        svgMute.classList.toggle("disabled", false);
        svgUnmute.classList.toggle("disabled", true);
    }
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
video.addEventListener("loadedmetadata", () => {
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
    var pos = (e.pageX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
    //progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + "%";
});

rewind.addEventListener("click", () => {
    alterTime("-");
});

forward.addEventListener("click", () => {
    alterTime("+");
});

const alterTime = (dir) => {
    let time;

    if (dir === "-") {
        time = video.currentTime < 5 ? 0 : video.currentTime - 5;
    } else if (dir === "+") {
        time =
            video.currentTime + 5 > video.duration
                ? video.duration
                : video.currentTime + 5;
    }

    video.currentTime = time;
    progress.setAttribute("value", video.currentTime);
};

// FULLSCREEN MODE

// provera da li browser podrzava fullscreen API i da li je enable
const isFullScreenEnabled = !!(
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.msFullscreenEnabled ||
    document.webkitSupportsFullscreen ||
    document.webkitFullscreenEnabled ||
    document.createElement("video").webkitRequestFullScreen
);

if (!isFullScreenEnabled) {
    fullscreen.style.display = "none";
}

fullscreen.addEventListener("click", () => {
    handleFullscreen();
    svgEnterFS.classList.toggle("disabled", videoContainer.dataset.fullscreen);
    svgExitFS.classList.toggle("disabled", !videoContainer.dataset.fullscreen);
    console.log(videoContainer.dataset.fullscreen);

    // if (videoContainer.dataset.fullscreen) {
    //     svgEnterFS.classList.toggle('disabled', true)
    //     svgExitFS.classList.toggle('disabled', false)
    // } else {
    //     svgEnterFS.classList.toggle('disabled', false)
    //     svgExitFS.classList.toggle('disabled', true)
    // };
});

const handleFullscreen = () => {
    if (isFullScreenActive()) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitCancelFullScreen)
            document.webkitCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setFullscreenData(false);
    } else {
        if (videoContainer.requestFullscreen)
            videoContainer.requestFullscreen();
        else if (videoContainer.mozRequestFullScreen)
            videoContainer.mozRequestFullScreen();
        else if (videoContainer.webkitRequestFullScreen)
            videoContainer.webkitRequestFullScreen();
        else if (videoContainer.msRequestFullscreen)
            videoContainer.msRequestFullscreen();
        setFullscreenData(true);
    }
};

const isFullScreenActive = () => {
    return !!(
        document.fullscreen ||
        document.webkitIsfullScreen ||
        document.mozFullScreen ||
        document.msFullscreenElement ||
        document.fullscreenElement
    );
};
// pomocna fja koja video kontejneru dodaje data atribut fullscreen / boolean da bi detektovali mod i lakse se stilizovali elementi u odgovarajucem modu
var setFullscreenData = function (state) {
    videoContainer.setAttribute("data-fullscreen", !!state);
};

document.addEventListener("fullscreenchange", function (e) {
    setFullscreenData(!!(document.fullscreen || document.fullscreenElement));
});
document.addEventListener("webkitfullscreenchange", function () {
    setFullscreenData(!!document.webkitIsFullScreen);
});
document.addEventListener("mozfullscreenchange", function () {
    setFullscreenData(!!document.mozFullScreen);
});
document.addEventListener("msfullscreenchange", function () {
    setFullscreenData(!!document.msFullscreenElement);
});
