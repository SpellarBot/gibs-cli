import {
	fs,
	promisify
}						from './config';

const fsReadFile		= promisify(fs.readFile);

export default async () => {
	try {
		let stats		= {};
		let allLinks	= await fsReadFile('links/images.json', { encoding: 'utf-8' });
		allLinks		= allLinks ? Object.keys(JSON.parse(allLinks)) : {};

		for (const image of allLinks) {
			let parts = image.split('/');


			if (!stats[parts[3]]) {
				stats[parts[3]] = {
					images		: 1,
					startTime	: 0,
					endTime		: 0
				};
			} else {


				stats[parts[3]] = {
					images: stats[parts[3]].images + 1
				};
			}

			stats.totalImages = stats.totalImages + 1 || 1;
		}

		console.log(stats);
	} catch (error) {
		console.log('last catch block', error);
	}
};