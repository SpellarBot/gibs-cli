import { bgCyan } from 'chalk';

export default class ProgressBar {
	constructor() {
		this.total;
		this.current;
		this.bar_length = process.stdout.columns - 150;
		this.timestamp = Date.now();
		this.averageTimeCounter = 0;
		this.timeRemaining = '';
	}

	init(total) {
		this.total = total;
		this.current = 0;
		this.update(this.current);
	}

	update(current) {
		this.current			= current;
		const current_progress	= this.current / this.total;
		if (this.averageTimeCounter === 10) {
			const currentTime	= Date.now();
			this.timeRemaining	= ((currentTime - this.timestamp) * (.1 / current_progress) / 60).toFixed(0) + ' Minutes';
			this.timestamp		= currentTime;
			this.averageTimeCounter = 0;
		} else {
			this.averageTimeCounter++;
		}

		this.draw(current_progress, this.timeRemaining);
	}

	draw(current_progress, timeRemaining) {
		const filled_bar_length	= (current_progress * this.bar_length).toFixed(0);
		const empty_bar_length	= this.bar_length - filled_bar_length;

		const filled_bar = this.get_bar(filled_bar_length, ' ', bgCyan);
		const empty_bar = this.get_bar(empty_bar_length, '-');
		const percentage_progress = (current_progress * 100).toFixed(2);

		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		process.stdout.write(
			`Processing: | Time Remaining: ${timeRemaining || ''} | [${filled_bar}${empty_bar}] | ${percentage_progress}%`
		);
	}

	get_bar(length, char, color = a => a) {
		let str = '';
		for (let i = 0; i < length; i++) {
			str += char;
		}
		return color(str);
	}
}
