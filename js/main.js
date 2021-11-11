import {initializeDragnDrop} from './moviesList.js'
import {initializeVideoPlayer} from './videoPlayer.js'
import {initializeDragnDropTouch} from './dragNdropTouch.js'

window.addEventListener('DOMContentLoaded', () => {
    initializeVideoPlayer()
    initializeDragnDrop()
    initializeDragnDropTouch()
})


