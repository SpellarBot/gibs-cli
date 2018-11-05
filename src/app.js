import			'@babel/polyfill';
import download	from './download';
import injest	from './injest';

const app = async () => {
	try {
		if (process.argv.includes('injest')) {
			await injest();
		}

		if (process.argv.includes('download')) {
			await download();
		}

		process.exit();
	} catch (error) {
		console.log(error);
		process.exit();
	}
};

app();