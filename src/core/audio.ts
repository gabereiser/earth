
export class BGM {
	player: HTMLAudioElement
	constructor() {
		this.player = new Audio();
		document.body.appendChild(this.player);
	}

	async play() {
		this.player.autoplay = true;
		this.player.loop = true;
		this.player.src = "bgm.mp3";
		this.player.load();
		try {
			await this.player.play();
		} catch (e) {
			console.log(e);
			const t = this;
			setTimeout(() => { t.play(); }, 5000) // keep trying baby! eventually they will rotate and the bgm will play.
		}
	}
}