// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player

// https://freshman.tech/custom-html5-video/

import { mobileAndTabletCheck, formatTime } from "./helper.js";

const videoContainer = document.querySelector("#videoContainer");
const video = document.querySelector("#video");
const videoControls = document.querySelector("#videoControls");
const playpause = document.getElementById("playpause");
const rewind = document.getElementById("rewind");
const forward = document.getElementById("forward");
const timeContainer = document.getElementById("timeContainer");
const timeElapsed = document.getElementById("timeElapsed");
const duration = document.getElementById("duration");
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

const movies = document.querySelector(".movies");

// proveri da li browser podrzava video tag i u zavisnosti od toga omoguci ili disable custom controls
const isVideoSupported = !!document.createElement("video").canPlayType;

if (isVideoSupported) {
    video.controls = false;
    videoControls.style.display = "block";
}

// Media API properties - muted, ended, paused, currentTime, volume, duration
// events related to HTML 5 video tag - play, pause, loadedmetadata, timeupdate

playpause.addEventListener("click", () => {
    // proveri najpre da li postoji source tag
    if (!video.duration) {
        alert("Najpre odaberite video!");
        return;
    }

    timeContainer.style.opacity = "1";

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
});

volinc.addEventListener("click", () => {
    if (video.muted) return;
    alterVolume("+");

    if (video.volume > 0.1 && !video.muted) {
        svgMute.classList.toggle("disabled", true);
        svgUnmute.classList.toggle("disabled", false);
    }
});

voldec.addEventListener("click", () => {
    if (video.muted) return;
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

    //const videoDuration = Math.round(video.duration);
    const time = formatTime(video.duration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
});

// sa svakim frejmom video okida se ovaj event
video.addEventListener("timeupdate", () => {
    let time;

    // ukoliko nema max atributa, ovde mora da bude ucitan , slucaj FF
    if (!progress.getAttribute("max")) {
        progress.setAttribute("max", video.duration);

        time = formatTime(video.duration);
        duration.innerText = `${time.minutes}:${time.seconds}`;
    }

    // u slucaju kad video dodje do kraja ili se premotava do kraja
    if (video.currentTime === video.duration) {
        video.pause();
        video.currentTime = 0;
        progress.value = 0;
        svgPlay.classList.toggle("disabled", false);
        svgPause.classList.toggle("disabled", true);
        return;
    }

    progress.setAttribute("value", video.currentTime);
    progressBar.style.width =
        Math.floor((video.currentTime / video.duration) * 100) + "%";

    time = formatTime(video.currentTime);
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
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

    const toBoolean = videoContainer.dataset.fullscreen === "true";

    if (toBoolean) {
        videoContainer.classList.add("fullscreen-mode");
    } else {
        videoContainer.classList.remove("fullscreen-mode");
    }

    svgEnterFS.classList.toggle("disabled", toBoolean);
    svgExitFS.classList.toggle("disabled", !toBoolean);
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

// prikazi i skloni controle u fullscreen modu kada mije touch uredjaj
videoContainer.addEventListener("click", (e) => {
    if (isFullScreenActive() && !mobileAndTabletCheck()) {
        videoControls.style.transform = "scale(1)";
    }

    if (
        e.target.id === "videoControls" &&
        isFullScreenActive() &&
        !mobileAndTabletCheck()
    ) {
        videoControls.style.transform = "scale(0)";
    }
});

// prikazi i skloni kontrole na touch uredjaju
videoContainer.addEventListener("touchstart", (e) => {
    if (mobileAndTabletCheck()) {
        videoControls.style.transform = "scale(1)";
    }

    if (e.target.id === "videoControls" && mobileAndTabletCheck()) {
        videoControls.style.transform = "scale(0)";
    }
});

// function debounce(func, timeout = 300) {
//     let timer;
//     return (...args) => {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             func.apply(this, args);
//         }, timeout);
//     };
// }

// if (mobileAndTabletCheck()) {
//     video.addEventListener("touchstart", () => {
//         videoControls.style.transform = "scale(1)";
//         //debounce(() => {videoControls.style.transform = "scale(0)";})
//         setTimeout(() => {
//             videoControls.style.transform = "scale(0)";
//         }, 2000);
//     });
// }

// if (mobileAndTabletCheck()) {
//     video.addEventListener("touchstart", () => {
//         videoControls.style.transform = "scale(1)";

//         function remove() {
//             videoControls.style.transform = "scale(0)";
//         }

//         debounce(() => remove());
//     });
// }

movies.addEventListener("click", (e) => {
    if (e.target?.dataset?.link) {
        const link = e.target.dataset.link;
        video.innerHTML = "";

        const source = document.createElement("source");
        const notSupportedLink = document.createElement("a");

        source.setAttribute("src", link);
        source.setAttribute("type", "video/mp4");
        notSupportedLink.setAttribute("href", link);
        notSupportedLink.innerText = "Download file";

        video.append(source);
        video.append(notSupportedLink);

        video.load();
        video.play();
        timeContainer.style.opacity = "1";

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
});

//https://web.dev/drag-and-drop/#creating-draggable-content

let dragSrcEl = null;

function handleDragStart(e) {
    e.stopPropagation();
    this.style.opacity = "0.4";

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
  }

  function handleDragEnter(e) {
      this.classList.add("drag-over");
  }

function handleDragEnd(e) {
    this.style.opacity = "1";
}

function handleDragLeave(e) {
    this.classList.remove("drag-over");
}

function handleDrop(e) {
    e.stopPropagation(); // stops the browser from redirecting.

    if (dragSrcEl !== this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData("text/plain");
    }

    return false;
}

const dragabbleElements = movies.querySelectorAll("[draggable]");
dragabbleElements.forEach((element) => {
    element.addEventListener("dragstart", handleDragStart);
    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("dragleave", handleDragLeave);
    element.addEventListener("drop", handleDrop);
    element.addEventListener("dragend", handleDragEnd);
});
