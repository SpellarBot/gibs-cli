import ProgressBar		from './progressBar';
import {
	axios,
	cheerio,
	fs,
	promisify
}						from './config';

const fsReadFile		= promisify(fs.readFile);
const fsWriteFile		= promisify(fs.writeFile);

export default async () => {
	const baseUrl = 'https://www.ncdc.noaa.gov';
	try {
		const getLinks = async (webLink, filter) => {
			try {
				const links	= [];
				const w		= await axios.get(webLink);
				const $		= cheerio.load(w.data);
				let linky	= $('a');
				$(linky).map( (i, link) => {
					let workingLink = $(link).attr('href');
					if (workingLink && workingLink.includes(filter) && filter !== '/html/') {
						links.push(workingLink);
					} else if (workingLink && workingLink.includes(filter) && filter === '/html/') {
						workingLink		= workingLink.split('/');
						let interval	= workingLink[5].split('-')[1];
						interval		= ('0' + interval).slice(-2);
						workingLink.splice(-1,1);
						workingLink.push(webLink.split('/')[5]);
						let newLink = workingLink.join('/');
						newLink = `${newLink}-${interval}`;
						links.push(newLink);
					}
				});
				return links;
			} catch (error) {
				console.log('getLinks catch block');
			}
		};

		let yearLinks	= await fsReadFile('links/years.json', { encoding: 'utf-8' }).catch( () => {});
		let dayLinks	= await fsReadFile('links/days.json', { encoding: 'utf-8' }).catch( () => {});
		let allLinks	= await fsReadFile('links/images.json', { encoding: 'utf-8' }).catch( () => {});

		yearLinks		= yearLinks ? JSON.parse(yearLinks) : null;
		dayLinks		= dayLinks ? JSON.parse(dayLinks) : null;
		allLinks		= allLinks ? JSON.parse(allLinks) : {};

		if (!yearLinks) {
			console.log('\nDownloading Part 1 of 3');
			yearLinks		= await getLinks(`${baseUrl}/gibbs/year`, '/calendar/');
			await fsWriteFile('links/years.json', JSON.stringify(yearLinks, null, '\t'));
		}

		if (!dayLinks) {
			dayLinks		= {};
			const Bar		= new ProgressBar();
			let barCounter	= 1;
			console.log('\nDownloading Part 2 of 3');
			Bar.init(yearLinks.length);
			for (const yearLink of yearLinks) {
				Bar.update(barCounter);
				barCounter++;
				let newDayLinks = await getLinks(`${baseUrl}${yearLink}`, '/availability/');
				newDayLinks.map( (dayLink) => dayLinks[dayLink] = false);
			}
			await fsWriteFile('links/days.json', JSON.stringify(dayLinks, null, '\t'));
		}

		console.log('\nDownloading Part 3 of 3');
		const Bar		= new ProgressBar();
		Bar.init(1664068);

		for (const day of Object.entries(dayLinks)) {
			if (day[0] && !day[1]) {
				const dailyImageLinks = await getLinks(`${baseUrl}${day[0]}`, '/html/');
				await Promise.all(dailyImageLinks.map( (link) => {
					link			= link.replace('/html', '/image');
					allLinks[link]	= false;
				}));

				dayLinks[day[0]] = true;
				await fsWriteFile('links/days.json', JSON.stringify(dayLinks, null, '\t'));
				await fsWriteFile('links/images.json', JSON.stringify(allLinks, null, '\t'));
				Bar.update(Object.keys(allLinks).length);
			}
		}
	} catch (error) {
		console.log('last catch block', error);
	}
};