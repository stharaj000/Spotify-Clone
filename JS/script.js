console.log("LET's Start JavaScript")
let currentSong = new Audio();
let currfolder;



function formatToMMSS(seconds) {
    // Ensure the input is a number and is non-negative
    if (typeof seconds !== 'number' || seconds < 0) {

    }

    // Round down to the nearest whole number to remove milliseconds
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Format minutes and seconds to have leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}







async function getsongs(folder) {
    currfolder = folder;
    let musicapi = await fetch(`${folder}/`)
    let response = await musicapi.text();
    console.log(response)

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // songs.slice("1%20", ".mp3")

    let songUL = document.querySelector(".main_library").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li class="invert"><img src="img/music.svg" alt="">
                            <div class="info invert">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div id="artist">Raj</div>
                            </div>
                            <div class="playnow ">Play Now<img id="playbtn" class="invert" src="img/playbutton.svg"
                                    alt="">
                            </div>    
         </li>`
    }

    // Attaching Event Listener to each song


    Array.from(document.querySelector(".main_library").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)

            Playaudio(e.querySelector(".info").firstElementChild.innerHTML);
            if (playbutton.src == "img/pause.svg") {
                currentSong.play()
            }
        })
    })

    return songs

};

const Playaudio = (track, pause = false) => {
    currentSong.src = (`/${currfolder}/` + track)

    if (!pause) {
        currentSong.play()
        playbutton.src = "img/pause.svg"

    }
    document.querySelector(".songname").innerHTML = decodeURI(track);

};


async function displayAlbums() {
    let a = await fetch('Musics/')
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let card_container = document.querySelector(".card_container")
    Array.from(anchors).forEach(async e => {
        if (e.href.includes("/Musics")) {
            let folder = e.href.split("/").slice(-2)[0]
            // get the metadata of the folder
            let a = await fetch(`/Musics/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            card_container.innerHTML = card_container.innerHTML + `<div data-folder="${folder}" class="card boder">
                        <div class="play">
                            <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAwUlEQVR4nO3WMWoCQBCF4Q8CwTSms7XQPhfICWxyi1zBNqVX8Aq2llYhhNSCN7BU0ohNIBmbXUiZQmeV+OCvf1hmZx7XNM47lnjKFscvPvDYQhyFOYYtxIEvTNHLFkdhhxfcZYujsMYzbrLFUVhh1EIchQUeWogD35ihny2Owh4T3GeLK1uMcZstrrz+G/Em+6nrcHX/IrzY77TIXiCr7JW5zj4Sn2VSO8cS1pxNEfgpkzo4lbCmWdl7a1Vvr3HsHACr5CJWnhywpwAAAABJRU5ErkJggg==">
                        </div>

                        <img class="boder"
                            src="/Musics/${folder}/cover.jpeg"
                            alt="Img">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }

        // Adding event listener to Album   
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getsongs(`Musics/${item.currentTarget.dataset.folder}`)
                Playaudio(songs[0])
                playbutton.src = "img/pause.svg"
            })
        })
    })
}



async function main() {
    await getsongs("Musics/NCS");
    console.log(songs)

    Playaudio(songs[0], true)
    currentSong.volume = 0.5

    displayAlbums()


    // Attach Event Listener to Play, Pause and Next
    playbutton.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playbutton.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            playbutton.src = "img/playbutton.svg"
        }
    })


    // Making Song Time changing

    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${formatToMMSS(currentSong.currentTime)}/${formatToMMSS(currentSong.duration)}`
        document.querySelector(".dot").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    // Adding event listener to Progress Bar

    document.querySelector(".progressbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".dot").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Adding event listener to Previous Button
    previousbtn.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            Playaudio(songs[index - 1])
        }
    })

    // Adding event listener to next Button
    nextbtn.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            Playaudio(songs[index + 1])
        }
    })


    // Adding Event Listener to Volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })

}


document.getElementsByClassName("hamburger")[0].addEventListener("click", () => {
    document.getElementsByClassName("left")[0].style.left = "0";
})



document.getElementsByClassName("X")[0].addEventListener("click", () => {
    document.getElementsByClassName("left")[0].style.left = "-1000px";
})



// Adding Event Listener in Volume to mute

document.getElementsByClassName("volsvg")[0].addEventListener("click", (e) => {
    console.log("clicked")
    currentSong.volume = 0;

    if(e.target.src.includes("volume.svg")){
        e.target.src = "img/mute.svg"
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        
        
    }

    else{
        e.target.src = "img/volume.svg"
        currentSong.volume = 0.20
        document.querySelector(".range").getElementsByTagName("input")[0].value = 20;

    }
})






main();






