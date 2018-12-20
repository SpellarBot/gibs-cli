import { bgCyan } from 'chalk';

export default class ProgressBar {
	constructor() {
		this.total;
		this.current;
		this.bar_length		= parseInt(process.stdout.columns / 3);
		this.startTime		= process.hrtime.bigint();
	}

	init(total) {
		this.total = total;
	}

	update(current) {
		const currentTime			= process.hrtime.bigint();
		this.current				= current;
		const current_progress		= this.current / this.total;
		const itemsRemaining		= this.total - this.current;
		const timeDiff				= parseInt(currentTime - this.startTime);
		const itemPerSecond			= this.current / (timeDiff / Math.pow(10, 9));
		const secondsRemaining		= parseInt(itemPerSecond * itemsRemaining);

		this.draw(current_progress, this.parseSecondsToTimeRemainingString(secondsRemaining));
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

	parseSecondsToTimeRemainingString(seconds) {
		if (seconds > 86400) {
			return Math.round(seconds / 86400, 1) + ' Days';
		} else if (seconds > 3600) {
			return Math.round(seconds / 3600, 2) + ' Hours';
		} else if (seconds < 3600 && seconds > 60) {
			return parseInt(seconds / 3600) + ' Minutes';
		} else {
			return parseInt(seconds) + ' Seconds';
		}
	}

	get_bar(length, char, color = a => a) {
		let str = '';
		for (let i = 0; i < length; i++) {
			str += char;
		}
		return color(str);
	}
}
