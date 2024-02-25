let libraryMain = document.getElementById('library');
let signOut = document.getElementById('sign-out');
document.addEventListener('DOMContentLoaded', () => {
    const obj = JSON.parse(localStorage.getItem('user'));
    if (obj.library.length > 0) {
        obj.library.forEach(item => {
            let libraryItemDiv = document.createElement('div');
            libraryItemDiv.classList.add('library__item');

            let video = document.createElement('video');
            video.classList.add('video-thumbnail');

            let source = document.createElement('source');
            source.setAttribute('src', item.url);
            source.setAttribute('type', 'video/mp4');

            video.appendChild(source);

            video.addEventListener('loadedmetadata', function () {
                video.currentTime = Math.floor(video.duration / 2);

                let videoInfoDiv = document.createElement('div');
                videoInfoDiv.classList.add('video-info');

                let videoTitleDiv = document.createElement('div');
                videoTitleDiv.classList.add('video-title');
                videoTitleDiv.textContent = item.title;

                let videoDurationDiv = document.createElement('div');
                videoDurationDiv.classList.add('video-duration');
                videoDurationDiv.innerHTML = formatDuration(video.duration) + '</span>';

                videoInfoDiv.appendChild(videoTitleDiv);
                videoInfoDiv.appendChild(videoDurationDiv);
                libraryItemDiv.appendChild(videoInfoDiv);
            });

            libraryItemDiv.appendChild(video);
            libraryItemDiv.addEventListener('click', () => {
                sessionStorage.setItem('PL-active', item.url);
                window.open('./index.html','_self');
            });
            libraryMain.appendChild(libraryItemDiv);
        });
    } else {
        library.innerHTML += `You haven't seen anything yet`;
    }
});

function formatDuration(duration) {
    var seconds = Math.floor(duration % 60);
    var minutes = Math.floor(duration / 60) % 60;
    var hours = Math.floor(duration / 3600);
    return (hours ? hours + ':' : '') + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}

signOut.addEventListener('click', () => {
    localStorage.setItem('user', '');
    location.reload();
    window.open('./index.html', '_self')
});