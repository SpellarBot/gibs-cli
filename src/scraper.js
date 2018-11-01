import ProgressBar		from './progressBar';
import express			from 'express';
import {
	Fs,
	asyncHandler,
	axios,
	cheerio,
	fs,
	promisify
}						from './config';

const fsReadFile		= promisify(fs.readFile);
const fsWriteFile		= promisify(fs.writeFile);

const router			= express.Router();

router.get('/injest', asyncHandler( async (req, res) => {
	req.setTimeout(40000000);
	try {
		const getLinks = async (webLink, filter) => {
			try {
				const links	= [];
				const w		= await axios.get(webLink);
				const $		= cheerio.load(w.data);
				let linky	= $('a');
				$(linky).map( (i, link) => {
					let workingLink = $(link).attr('href');
					if (workingLink && workingLink.includes(filter) && filter !== '/gibbs/html/') {
						workingLink = 'https://www.ncdc.noaa.gov' + workingLink;
						links.push(workingLink);
					} else if (workingLink && workingLink.includes(filter) && filter === '/gibbs/html/') {
						workingLink		= workingLink.split('/');
						let interval	= workingLink[5].split('-')[1];
						interval		= ('0' + interval).slice(-2);
						workingLink.splice(-1,1);
						workingLink.push(webLink.split('/')[5]);
						let newLink = workingLink.join('/');
						newLink = `https://www.ncdc.noaa.gov${newLink}-${interval}`;
						links.push(newLink);
					}
				});
				return links;
			} catch (error) {
				console.log('getLinks catch block', error);
			}
		};

		const Bar		= new ProgressBar();
		Bar.init(1664068);

		let yearLinks	= await fsReadFile('links/years.json', { encoding: 'utf-8' }).catch( () => {});
		let dayLinks	= await fsReadFile('links/days.json', { encoding: 'utf-8' }).catch( () => {});
		let allLinks	= await fsReadFile('links/images.json', { encoding: 'utf-8' }).catch( () => {});

		yearLinks		= yearLinks ? JSON.parse(yearLinks) : null;
		dayLinks		= dayLinks ? JSON.parse(dayLinks) : null;
		allLinks		= allLinks ? JSON.parse(allLinks) : {};

		if (!yearLinks) {
			yearLinks		= await getLinks('https://www.ncdc.noaa.gov/gibbs/year', '/gibbs/calendar/');
			await fsWriteFile('links/years.json', JSON.stringify(yearLinks, null, '\t'));
		}

		if (!dayLinks) {
			dayLinks = {};
			for (const yearLink of yearLinks) {
				let newDayLinks		= await getLinks(yearLink, '/gibbs/availability/');
				newDayLinks.map( (dayLink) => {
					dayLinks[dayLink] = {
						link	: dayLink,
						pulled	: false
					};
				});
			}
			await fsWriteFile('links/days.json', JSON.stringify(dayLinks, null, '\t'));
		}

		for (const day of Object.values(dayLinks)) {
			if (!day.pulled) {
				const dailyImageLinks = await getLinks(day.link, '/gibbs/html/');
				await Promise.all(dailyImageLinks.map( (link) => {
					link			= link.replace('/html', '/image');
					allLinks[link]	= { link, pulled: false };
				}));

				dayLinks[day.link].pulled = true;
				await fsWriteFile('links/days.json', JSON.stringify(dayLinks, null, '\t'));
				await fsWriteFile('links/images.json', JSON.stringify(allLinks, null, '\t'));
				Bar.update(Object.keys(allLinks).length);
			}
		}

		res.status(200).send({
			code	: 200,
			status	: 'success',
			message	: 'scraped links'
		});
	} catch (error) {
		console.log('last catch block', error);
	}
}));

router.get('/download', asyncHandler( async (req, res) => {
	req.setTimeout(40000000);

	const downloadImage = async (link) => {
		try {
			let linkParts	= link.split('/');
			const dir		= `data/${linkParts[5]}/${linkParts[6]}`;
			const fileName	= `${linkParts[7]}.jpg`;
			await Fs.ensureDir(dir);

			if (fs.existsSync(`${dir}/${fileName}`)) {
				return;
			}

			const response		= await axios({
				method			: 'GET',
				url				: link,
				responseType	: 'stream'
			});

			response.data.pipe(fs.createWriteStream(`${dir}/${fileName}`));
			return new Promise( (resolve, reject) => {
				Bar.update(imagesDownloaded);
				response.data.on('end', () => resolve());
				response.data.on('error', () => reject());
			});
		} catch (error) {
			console.log('error');
		}
	};

	let allLinks	= await fsReadFile('links/images.json', { encoding: 'utf-8' });
	allLinks		= JSON.parse(allLinks);

	const Bar		= new ProgressBar();
	Bar.init(Object.keys(allLinks).length);

	let imagesDownloaded = 0;
	for (const image of Object.values(allLinks)) {
		await downloadImage(image.link, imagesDownloaded);
		imagesDownloaded++;
	}

	res.status(200).send({
		code	: 200,
		status	: 'success',
		message	: 'downloaded images'
	});
}));

export default router;