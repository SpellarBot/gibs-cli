import {
	fs,
	promisify
}						from './config';

const fsReadFile		= promisify(fs.readFile);

export default async () => {
	try {
		let stats		= { totalImages: 0, sats: {} };
		let allLinks	= await fsReadFile('links/images.json', { encoding: 'utf-8' });
		allLinks		= allLinks ? Object.keys(JSON.parse(allLinks)) : {};

		for (const image of allLinks) {
			let parts	= image.split('/');
			if (!stats.sats[parts[3]]) {
				stats.sats[parts[3]] = {
					images		: 1,
					startDate	: parts[5],
					endDate		: parts[5]
				};
			} else {
				stats.sats[parts[3]] = {
					images		: stats.sats[parts[3]].images + 1,
					startDate	: stats.sats[parts[3]].startDate < parts[5] ? stats.sats[parts[3]].startDate : parts[5],
					endDate		: stats.sats[parts[3]].endDate > parts[5] ? stats.sats[parts[3]].endDate : parts[5]
				};
			}
			stats.totalImages = stats.totalImages + 1;
		}

		console.log(JSON.stringify(stats));
	} catch (error) {
		console.log('last catch block', error);
	}
};