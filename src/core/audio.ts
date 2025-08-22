
export class BGM {
	player: HTMLAudioElement
	constructor() {
		this.player = new Audio();
		this.player.autoplay = true;
		this.player.loop = true;
		document.body.appendChild(this.player);
	}

	play() {
		this.player.src = "bgm.mp3";
	}
}