const list = [
    { "id": 1, "name": "If Your'e Reading This It's Too Late", "artist_name": "DRAKE", "cover_photo_url": "https://s3.amazonaws.com/hakuapps/prod/album-1.png" },
    { "id": 2, "name": "Hotter Than July", "artist_name": "Stevie Wonder", "cover_photo_url": "https://s3.amazonaws.com/hakuapps/prod/album-2.png" },
    { "id": 3, "name": "Overexposed", "artist_name": "Maroon 5", "cover_photo_url": "https://s3.amazonaws.com/hakuapps/prod/album-3.png" },
    { "id": 4, "name": "Hit n Run Phase One", "artist_name": "PRINCE", "cover_photo_url": "https://s3.amazonaws.com/hakuapps/prod/album-4.png" },
    { "id": 5, "name": "Brothers", "artist_name": "The Black Keys", "cover_photo_url": "https://s3.amazonaws.com/hakuapps/prod/album-5.png" }
];

const songlist = [
    { "id": 1, "album_id": 1, "song_name": "Legend", "song_order": 5, "song_label": ["explicit", "upbeat"], "song_duration": "4:01" },
    { "id": 2, "album_id": 1, "song_name": "Energy", "song_order": 1, "song_label": null, "song_duration": "3:01" },
    { "id": 3, "album_id": 1, "song_name": "10 Bands", "song_order": 4, "song_label": ["explicit", "upbeat"], "song_duration": "2:57" },
    { "id": 4, "album_id": 1, "song_name": "Know Yourself", "song_order": 2, "song_label": null, "song_duration": "4:35" },
    { "id": 5, "album_id": 1, "song_name": "No Tellin'", "song_order": 3, "song_label": ["explicit", "upbeat"], "song_duration": "5:10" }
];

var albumsAndSongs = [];

const carousel = document.querySelector('#carouselControls');
const tracklist = document.querySelector('#tracklist');

carousel.addEventListener('slid.bs.carousel', (event) => {
    createTrackList(event.to);
    tracklist.classList.toggle('show');

});

carousel.addEventListener('slide.bs.carousel', (event) => {
    tracklist.classList.toggle('show');
});

window.addEventListener('load', () => {
    var albums = list;
    for (var i = 0; i < albums.length; ++i) {
        console.log(albums[i]);
        const carouselItem = createCarouselItem(albums[i], i == 0);
        console.log(carouselItem)
        carousel.querySelector('.carousel-inner').appendChild(carouselItem);
    }

    fetch('https://cors-anywhere.herokuapp.com/https://stg-resque.hakuapp.com/albums.json')
        .then(function (response) {
            return response.json();
        }).then(function (albums) {
            for (var i = 0; i < albums.length; ++i) {
                const album = albums[i];
                albumsAndSongs.push({ album: album });
                fetch('https://cors-anywhere.herokuapp.com/https://stg-resque.hakuapp.com/songs.json?album_id=' + album.id)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (songs) {
                        albumsAndSongs[i].songs = songs;
                    })
            }
        }).catch(function (error) {
            console.log(error);
        });

    console.log(albumsAndSongs)
    createCarousel();
    createTrackList(0);
})

function createCarousel() {
    for (var i = 0; i < albumsAndSongs.length; ++i) {
        const carouselItem = createCarouselItem(albumsAndSongs[i].album, i == 0);
        carousel.querySelector('.carousel-inner').appendChild(carouselItem);
    }
}

function createCarouselItem(album, active) {
    /**
     * artist_name: "DRAKE"
        cover_photo_url: "https://s3.amazonaws.com/hakuapps/prod/album-1.png"
        id: 1
        name: "If Your'e Reading This It's Too Late"
     */
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
            console.log(label);
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