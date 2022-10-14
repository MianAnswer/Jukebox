// store albums along with their respective songs
var albumsAndSongs = [];

const carousel = document.querySelector('#carouselControls');
const tracklist = document.querySelector('#tracklist');

// display current album's tracklist
carousel.addEventListener('slid.bs.carousel', (event) => {
    createTrackList(event.to);
    tracklist.classList.toggle('show');
});

// collapse current tracklist when changing album
carousel.addEventListener('slide.bs.carousel', (event) => {
    tracklist.classList.toggle('show');
});

// initialize albumsAndSongs after fetching album and song data
window.addEventListener('load', () => {
    fetchAlbums()
        .then(async albums => {
            for (const album of albums) {
                const songs = await fetchSongs(album.id);
                albumsAndSongs.push({ album: album, songs: songs });
            }

            // initialize carousel and tracklist
            createCarousel();
            createTrackList(0);
        })
        .catch(error => { console.log(error) })
})

/**
 * get albums
 * @returns {object}
 */
async function fetchAlbums() {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://stg-resque.hakuapp.com/albums.json');
    const albums = await response.json();
    return albums;
}

/**
 * get songs for specific album
 * @param {Number} albumId 
 * @returns 
 */
async function fetchSongs(albumId) {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://stg-resque.hakuapp.com/songs.json?album_id=' + albumId);
    const songs = await response.json();
    return songs;
}

/**
 * creates the carousel of albums
 */
function createCarousel() {
    for (var i = 0; i < albumsAndSongs.length; ++i) {
        const carouselItem = createCarouselItem(albumsAndSongs[i].album, i == 0);
        carousel.querySelector('.carousel-inner').appendChild(carouselItem);
    }
}

/**
 * creates the albums carousel item
 * @param {object} album 
 * @param {boolean} active 
 * @returns {node}
 */
function createCarouselItem(album, active) {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    carouselItem.classList.add('card');
    carouselItem.classList.add('text-center');
    if (active) {
        carouselItem.classList.add('active');
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    carouselItem.appendChild(cardBody);
    
    const img = document.createElement('img');
    img.setAttribute('src', album.cover_photo_url);
    img.classList.add('d-block');
    img.classList.add('w-100');
    cardBody.appendChild(img);

    const albumTitle = document.createElement('h5');
    albumTitle.classList.add('card-title');
    albumTitle.innerText = album.name;
    cardBody.appendChild(albumTitle);

    const artistName = document.createElement('h6');
    artistName.classList.add('card-subtitle');
    artistName.innerText = album.artist_name;
    cardBody.appendChild(artistName);

    return carouselItem;
}

/**
 * creates the tracklist for the current album
 * @param {Number} albumPos 
 */
function createTrackList(albumPos) {
    const orderedList = document.createElement('ul');
    orderedList.classList.add('list-group');
    const songs = albumsAndSongs[albumPos].songs.sort((a, b) => {
        return a.song_order - b.song_order;
    });
    for (const track of songs) {
        const listItem = createTrack(track);
        orderedList.appendChild(listItem);
    }
    if (tracklist.firstChild) {
        tracklist.replaceChild(orderedList, tracklist.firstChild);
    } else {
        tracklist.appendChild(orderedList);
    }
}

/**
 * creates the track information
 * @param {object} track 
 * @returns {node}
 */
function createTrack(track) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.classList.add('d-flex');

    const trackNumber = document.createElement('div');
    trackNumber.classList.add('p-2');
    trackNumber.classList.add('track-number');
    trackNumber.appendChild(document.createTextNode(track.song_order));
    listItem.appendChild(trackNumber);

    const starIcon = document.createElement('i');
    starIcon.classList.add('p-2');
    starIcon.classList.add('bi');
    starIcon.classList.add('bi-star-fill');
    listItem.appendChild(starIcon);
    starIcon.addEventListener('click', (event) => {
        event.target.classList.toggle('checked');
    });

    const songName = document.createElement('div');
    songName.classList.add('p-2');
    songName.appendChild(document.createTextNode(track.song_name));
    listItem.appendChild(songName);

    if (track.song_label != null) {
        for (const label of track.song_label) {
            const span = document.createElement('span');
            span.classList.add('p-2');
            span.appendChild(document.createTextNode(label));
            listItem.appendChild(span);
        }
    }

    const songDuration = document.createElement('div');
    songDuration.classList.add('p-2');
    songDuration.classList.add('ms-auto');
    songDuration.appendChild(document.createTextNode(track.song_duration));
    listItem.appendChild(songDuration);

    return listItem;
}