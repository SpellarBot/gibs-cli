import ProgressBar		from './progressBar';
import {
	Fs,
	axios,
	fs,
	promisify
}						from './config';

const fsReadFile		= promisify(fs.readFile);

export default async () => {
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
			console.log(error);
			console.log('error');
		}
	};

	let allLinks	= await fsReadFile('links/images.json', { encoding: 'utf-8' });
	allLinks		= JSON.parse(allLinks);

	const Bar		= new ProgressBar();
	let totalImages	= 0;

	for (const image of Object.values(allLinks)) {
		const imageLinkParts	= image.link.split('/');
		const satillite			= imageLinkParts[5];
		if (satillite === 'GOE-16') {
			totalImages++;
		}
	}

	console.log('Total Images:', totalImages);
	Bar.init(totalImages);

	let imagesDownloaded = 0;
	for (const image of Object.values(allLinks)) {
		const imageLinkParts	= image.link.split('/');
		const satillite			= imageLinkParts[5];
		if (satillite === 'GOE-16') {
			await downloadImage(image.link, imagesDownloaded);
			imagesDownloaded++;
		}
	}
};