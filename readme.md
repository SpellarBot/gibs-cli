# Gibs Puller

This is a command line tool written in Nodejs that pulls links and images from the aging GIBBS website. While https://www.ncdc.noaa.gov is still being updated weekly, it is likely to be replaced by https://worldview.earthdata.nasa.gov/ in the near future.

This tool is simple and under active development. Here is how it works.

### Getting started
```bash
git clone https://github.com/brenwkennedy/gibs-puller
npm i
```

### Download the latest links
This repo contains cached links of all images, theses are located in the links directory.

To update these links with images that have been published since the links were last updated, you can run the following command
```bash
npm run start injest
```
or 
```bash
npm run build
node dist/app.js injest
```

### Download images
Download images from satellites
```bash
npm run start download sat GOE-16
```
Downloads all images (~1.6M)
```bash
npm run start download all
```
