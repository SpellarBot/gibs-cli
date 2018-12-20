import ProgressBar		from './progressBar';
import {
	Fs,
	axios,
	fs,
	promisify
}						from './config';

const fsReadFile		= promisify(fs.readFile);

const downloadImage = async link => {
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
			response.data.on('end', () => resolve());
			response.data.on('error', () => reject());
		});
	} catch (error) {
		console.log('error:', error.code);
	}
};

export default async program => {
	const satellitesToDownload = program.download;
	let allLinks	= JSON.parse(await fsReadFile('links/images.json', { encoding: 'utf-8' }));
	const dlLinks	= [];

	for (const image of Object.keys(allLinks)) {
		const imageLinkParts	= image.split('/');
		const satellite			= imageLinkParts[3];
		if (satellitesToDownload.includes('ALL') || satellitesToDownload.includes(satellite)) {
			dlLinks.push('https://www.ncdc.noaa.gov' + image);
		}
	}

	const Bar		= new ProgressBar();
	Bar.init(dlLinks.length);

	let iterPos = 0;
	for (const link of dlLinks) {
		await downloadImage(link);
		iterPos++;
		Bar.update(iterPos);
	}
};
