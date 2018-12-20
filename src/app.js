import					'@babel/polyfill';
import calculateStats	from './calculateStats';
import download			from './download';
import injest			from './injest';
import program			from 'commander';

const main = async () => {
	try {

		const commaSeparatedList = val => {
			return val.toUpperCase().split(',');
		};

		program
			.version('1.0.0')
			.option('-d, --download <items>', 'Download satellite images', commaSeparatedList)
			.option('-s, --stats', 'Stats')
			.option('-i, --injest', 'Injest images and store cached links')
			.parse(process.argv);

		if (program.download) {
			await download(program);
		} else if (program.injest) {
			await injest();
		} else if (program.stats) {
			await calculateStats();
		} else {
			console.log('You did not input a valid command');
			process.exit();
		}
	} catch (error) {
		console.log(error);
		process.exit();
	}
};

main();
