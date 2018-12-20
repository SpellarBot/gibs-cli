import					'@babel/polyfill';
import calculateStats	from './calculateStats';
import download			from './download';
import injest			from './injest';

const injestDownloadCommands = (argv) => {
	if (!(argv.length >= 4)) {
		throw 'You need to input more than just download';
	}

	let commands = {};
	for (let i = 3; i < argv.length; i = i + 2) {
		commands[argv[i].toUpperCase()] = argv[i + 1].toUpperCase();
	}

	// TODO: Validate commands here

	return commands;
};

const app = async () => {
	try {
		if (process.argv.includes('injest')) {
			await injest();
		}

		if (process.argv.includes('stats')) {
			await calculateStats();
		}

		if (process.argv.includes('download')) {
			const commands = injestDownloadCommands(process.argv);
			await download(commands);
		}

		process.exit();
	} catch (error) {
		console.log(error);
		process.exit();
	}
};

app();
