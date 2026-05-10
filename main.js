var currentId = "";
var currentInterval;


function formattedDuration(seconds) {
	let result = "";
	seconds = Math.floor(seconds);
	result += seconds;
	return Math.floor(seconds/60) + ":" + String(seconds%60).padStart(2, "0");
}


function load() {
	let tracks = document.getElementsByClassName("track");
	for (track of tracks) {
		let controls = track.getElementsByClassName("controls")[0];
		let audio = controls.getElementsByTagName("audio")[0];
		audio.controls = false;
		controls.innerHTML += `
			<button class="play" onclick="togglePlay('${track.id}')"><img src="icons/play.png"/></button>
			<div class="time">0:00</div>
			<div class="progress"><div class="indicator"></div></div>
			<div class="duration">${formattedDuration(audio.duration)}</div>
		`;
	}
	updateSectionHighlight();
}


function updateSectionHighlight() {
	let pos = document.documentElement.scrollTop;
	let classicalSectionHeight = document.getElementById("classical").clientHeight;
	let contemporarySectionHeight = document.getElementById("contemporary").clientHeight;
	let soundtracksSectionHeight = document.getElementById("soundtracks").clientHeight;
	if (pos < classicalSectionHeight) {
		document.getElementById("classicalLink").classList.add("activeSection");
		document.getElementById("contemporaryLink").classList = [];
		document.getElementById("soundtracksLink").classList = [];
		document.getElementById("arrangementsLink").classList = [];
	} else if (pos < classicalSectionHeight + contemporarySectionHeight) {
		document.getElementById("classicalLink").classList = [];
		document.getElementById("contemporaryLink").classList.add("activeSection");
		document.getElementById("soundtracksLink").classList = [];
		document.getElementById("arrangementsLink").classList = [];
	} else if (pos < classicalSectionHeight + contemporarySectionHeight + soundtracksSectionHeight) {
		document.getElementById("classicalLink").classList = [];
		document.getElementById("contemporaryLink").classList = [];
		document.getElementById("soundtracksLink").classList.add("activeSection");
		document.getElementById("arrangementsLink").classList = [];
	} else {
		document.getElementById("classicalLink").classList = [];
		document.getElementById("contemporaryLink").classList = [];
		document.getElementById("soundtracksLink").classList = [];
		document.getElementById("arrangementsLink").classList.add("activeSection");
	}
}


function scrollToSection(section) {
	event.preventDefault();
	let pos;
	switch (section) {
		case 'classical':
			pos = 0;
			break;
		case 'contemporary':
			pos = document.getElementById("classical").clientHeight;
			break;
		case 'soundtracks':
			pos = document.getElementById("classical").clientHeight + document.getElementById("contemporary").clientHeight;
			break;
		case 'arrangements':
			pos = document.getElementById("classical").clientHeight + document.getElementById("contemporary").clientHeight+ document.getElementById("soundtracks").clientHeight;
			break;
		default:
			pos = 0;
	}
	window.scrollTo({top: pos, behavior: "smooth"});
}


function updateTime() {
	let track = document.getElementById(currentId);
	let audio = track.getElementsByTagName("audio")[0];
	let time = track.getElementsByClassName("time")[0];
	let indicator = track.getElementsByClassName("indicator")[0];
	time.innerHTML = formattedDuration(audio.currentTime);
	indicator.style.width = `${audio.currentTime/audio.duration * 100}%`;
	if (audio.currentTime == audio.duration) {
		let playButton = track.getElementsByClassName("play")[0];
		playButton.innerHTML = `<img src="icons/play.png"/>`;
		clearInterval(currentInterval);
	}
}


function getPosition(e) {
	let rect = e.target.getBoundingClientRect();
	return (e.clientX - rect.x) / rect.width;
}


function seek(currentProgress) {
	let track = document.getElementById(currentId);
	let audio = track.getElementsByTagName("audio")[0];
	let time = track.getElementsByClassName("time")[0];
	let indicator = track.getElementsByClassName("indicator")[0];
	audio.currentTime = currentProgress * audio.duration;
	time.innerHTML = formattedDuration(audio.currentTime);
	updateTime();
}


function togglePlay(id) {
	let track = document.getElementById(id);
	let audio = track.getElementsByTagName("audio")[0];
	let playButton = track.getElementsByClassName("play")[0];
	
	if (id != currentId) {
		if (currentId != "") {
			let lastTrack = document.getElementById(currentId);
			let lastAudio = lastTrack.getElementsByTagName("audio")[0];
			let lastPlayButton = lastTrack.getElementsByClassName("play")[0];
			let lastTime = lastTrack.getElementsByClassName("time")[0];
			let lastIndicator = lastTrack.getElementsByClassName("indicator")[0];
			lastAudio.pause();
			lastAudio.currentTime = 0;
			lastPlayButton.innerHTML = `<img src="icons/play.png"/>`;
			lastTime.innerHTML = "0:00";
			lastIndicator.style.width = 0;
		}
		currentId = id;
		let progress = track.getElementsByClassName("progress")[0];
		progress.addEventListener("mousedown", function(e) {
			console.log(getPosition(e));
			seek(getPosition(e));
		});
	}
	
	if (audio.paused || audio.currentTime == 0 || audio.currentTime == audio.duration) {
		audio.play();
		playButton.innerHTML = `<img src="icons/pause.png"/>`;
		currentInterval = setInterval(updateTime, 200);
	} else {
		audio.pause();
		playButton.innerHTML = `<img src="icons/play.png"/>`;
		clearInterval(currentInterval);
	}
}


