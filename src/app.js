import							'@babel/polyfill';
import bodyParser				from 'body-parser';
import compression				from 'compression';
import cors						from 'cors';
import express					from 'express';
import scraper					from './scraper';

const app						= express();
const port						= 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(compression());

app.use('/scraper', scraper);

// // Storage config
// const storage		= Storage({
// 	projectId		: 'tools-bken-io-219502',
// 	keyFilename		: 'src/key.json'
// });

// const bucket		= storage.bucket('gibbs');

// app.post('/convert', asyncHandler( async (req, res) => {

// 	// copy files to processing dir

// 	async function copyFiles() {
// 		try {
// 			const testFolder = './external/frames/';

// 			Fs.readdir(testFolder, (err, files) => {
// 				files.sort();
// 				let num = 1;
// 				files.forEach( (file) => {
// 					console.log(file);
// 					Fs.rename(`./external/frames/${file}`, `./external/frames/${('000' + num).slice(-4)}.jpg`, (err) => {
// 						if ( err ) console.log('ERROR: ' + err);
// 					});
// 					num++;
// 				});
// 			});

// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}

// 	copyFiles();

// 	// create video

// 	// upload video

// 	// return video to user

// 	// update database

// 	res.status(200).end();

// 	// const ffmpegCommand = '.\ffmpeg.exe -r 60 -f image2 -s 1920x1080 -i ..\data\GOE-16\IR\2018-01-01-03.jpg -vcodec libx264 -crf 25  -pix_fmt yuv420p test.mp4';

// }));

// app.post('/stats', asyncHandler( async (req, res) => {
// 	const sat		= req.body.sat.toUpperCase();
// 	const channel	= req.body.channel.toUpperCase();
// 	const images	= await db.collection('gibbs').doc(sat).collection(channel).get();
// 	let size		= 0;

// 	await Promise.all(images.docs.map( async (image) => {
// 		const d = image.data();
// 		try {
// 			if (d.code === 200 && d.url) {
// 				const cloudPath		= `images/${sat}/${d.channel}/${d.fileName}${d.extension}`;
// 				const [fileMeta]	= await bucket.file(cloudPath).getMetadata();
// 				await db.collection('gibbs').doc(sat).collection(d.channel).doc(d.fileName).update({ size: parseInt(fileMeta.size) });
// 				size += parseInt(fileMeta.size);
// 			}
// 		} catch (error) {
// 			await db.collection('gibbs').doc(sat).collection(d.channel).doc(d.fileName).update({ code: 500 });
// 			console.log('error, updating doc with 500 code');
// 		}
// 	}));

// 	await db.collection('gibbs').doc(sat).update({
// 		[`size.${channel}`]	: size
// 	});
// 	res.status(200).send({
// 		code	: 200,
// 		status	: 'success',
// 		message	: `total size of ${channel} channel is ${(size / 1048576).toFixed(3)} MB`
// 	});
// }));

// app.post('/', asyncHandler( async (req, res) => {
// 	req.setTimeout(40000000);

// 	const downloadImage = async (imageLink) => {
// 		const linkParts	= imageLink.split('/');
// 		const sat		= linkParts[5].toUpperCase();
// 		const channel	= linkParts[6].toUpperCase();
// 		const dateParts	= linkParts[7].split('-');
// 		const year		= dateParts[0];
// 		const month		= dateParts[1];
// 		const day		= dateParts[2];
// 		const time		= dateParts[3];

// 		try {
// 			const cloudPath		= `images/${sat}/${channel}/${year}-${month}-${day}-${time}.jpg`;
// 			const response		= await axios({ method: 'get', url: imageLink, responseType: 'stream' });
// 			const newMetadata	= { contentDisposition : `attachment; filename=${year}-${month}-${day}-${time}.jpg` };
// 			const fileStream	= bucket.file(cloudPath).createWriteStream({ resumable: false, metadata: newMetadata });
// 			response.data.pipe(fileStream);
// 			const uploadStream = new Promise( (resolve, reject) => {
// 				response.data.on('end', () => resolve());
// 				response.data.on('error', (err) => reject(err));
// 			});
// 			await uploadStream;
// 			const [url]			= await bucket.file(cloudPath).getSignedUrl({
// 				action			: 'read',
// 				expires			: '03-09-2491'
// 			});

// 			return [200, url];
// 		} catch (error) {
// 			let code = 500;
// 			if (error && error.response && error.response.status) {
// 				code = error.response.status;
// 			}
// 			console.log('something went wrong while uploading an image', error && error.response && error.response.status);
// 			return [code];
// 		}
// 	};

// 	const imageExists = async (sat, channel, fileName) => {
// 		const image = await db.collection('gibbs').doc(sat).collection(channel).doc(fileName).get();
// 		if (image.exists) {
// 			return image.data();
// 		}
// 	};

// 	const createEntry = async (fileName, code, url, size, year, month, day, interval, sat, channel) => {
// 		await db.collection('gibbs').doc(year).collection(fileName).doc(sat).set({
// 			[channel] : {
// 				fileName,
// 				year,
// 				interval,
// 				url			: url || '',
// 				size		: size || 0,
// 				extension	: '.jpg',
// 				channel		: req.body.channel.toUpperCase(),
// 				month		: ('0' + month).slice(-2),
// 				day			: ('0' + day).slice(-2),
// 				code		: code || 500,
// 				id			: uuid()
// 			}
// 		}, { merge: true });
// 	};

// 	const downloadYear = async (sat, channel, year) => {
// 		let intervals = ['00', '03', '06', '09', '12', '15', '18', '21'];
// 		for (let month = 1; month <= 12; month++) {
// 			for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
// 				for (const interval of intervals) {
// 					const fileName		= `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}-${interval}`;
// 					const imageLink		= `https://www.ncdc.noaa.gov/gibbs/image/${req.body.sat.toUpperCase()}/${req.body.channel.toUpperCase()}/${fileName}`;
// 					const dbImage		= await imageExists(sat, channel, fileName);
// 					if (dbImage && dbImage.code > 200) {
// 						const image		= await downloadImage(imageLink);
// 						await createEntry(fileName, image[0], image[1], image[2], year, month, day, interval, sat, channel);
// 						console.log(`uploaded new ${fileName}`);
// 					} else if (!dbImage) {
// 						const image		= await downloadImage(imageLink);
// 						await createEntry(fileName, image[0], image[1], image[2], year, month, day, interval, sat, channel) ;
// 						console.log(`uploaded new ${fileName}`);
// 					} else if (dbImage && dbImage.code === 200) {
// 						console.log('existing image found', dbImage.fileName);
// 					}
// 				}
// 			}
// 		}
// 	};

// 	const sat		= req.body.sat.toUpperCase();
// 	const channel	= req.body.channel.toUpperCase();
// 	const year		= req.body.year;
// 	const dbCache	= await db.collection('gibbs').doc(sat).collection(channel).get();

// 	await downloadYear(sat, channel, year, dbCache);

// 	res.status(200).send({
// 		code	: 200,
// 		status	: 'success',
// 		message	: 'pulling gibs'
// 	});
// }));

// app.post('/createDocs', asyncHandler( async (req, res) => {
// 	const createDocs = () => {
// 		const docs	= [];
// 		let intervals	= ['00', '03', '06', '09', '12', '15', '18', '21'];
// 		for (let year = 1974; year <= 2018; year++) {
// 			for (let month = 1; month <= 12; month++) {
// 				for (let day = 1; day <= new Date(year, month, 0).getDate(); day++) {
// 					for (const interval of intervals) {
// 						const fileName		= `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}-${interval}`;
// 						docs.push({
// 							updated	: Date.now(),
// 							year, month, day, interval,
// 							images	: 0,
// 							size	: 0,
// 							id		: fileName
// 						});
// 						console.log('documents', docs.length);
// 					}
// 				}
// 			}
// 		}

// 		return docs;
// 	};

// 	const docs = createDocs();
// 	await mdb.collection('gibbs').insertMany(docs);
// 	res.status(200).end();
// }));

app.listen(port, () => console.log(`boilerplate listening on port ${port}!`));