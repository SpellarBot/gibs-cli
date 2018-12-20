import Fs						from 'fs-extra';
import axios					from 'axios';
import cheerio					from 'cheerio';
import fs						from 'fs';
import request					from 'request';
import { promisify }			from 'util';

const asyncHandler = fn => (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next);};

export {
	asyncHandler,
	axios,
	cheerio,
	fs,
	request,
	promisify,
	Fs
};
