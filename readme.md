# Gibs Puller

This is a command line tool written in Nodejs that pulls links and images from the aging GIBBS website. While https://www.ncdc.noaa.gov is still being updated weekly, it is likely to be replaced by https://worldview.earthdata.nasa.gov/ in the near future.

This tool is simple and under active development. Here is how it works.

### Getting started

```bash
git clone https://github.com/brenwkennedy/gibs-puller
npm i
```

### How it works

![flowchart](https://i.imgur.com/ZLrZUOR.png)

### Download the latest links

This repo contains cached links of all images, these links are located in the links directory as .json files.

To update the links with the latest data, remove the existing .json files in the links directory and run the injest command

```bash
npm run start -- -i
```

### Download images

Download images from specific satellites

```bash
npm run start -- -d GOE-16
```

Download images from specific channel

```bash
npm run start -- -d GOE-16 -c WV
```

Downloads all images (~1.6M)

```bash
npm run start -- -d all
```

### Flags
`-i` `--injest` - caches links from NASA gibbs website
`-d` `--download` - accepts `all, GOE-15, SMS-1` etc..
`-c` `--channel` - accepts `IR, WV, VS, RG`

### Available Satellites (updating)
```json
{
	"totalImages":1664937,
	"sats":{
		"SMS-1":{
			"images":2064,
			"startDate":"1974-01-01-00",
			"endDate":"1979-04-19-18"
		},
		"GOES2":{
			"images":3921,
			"startDate":"1976-04-23-00",
			"endDate":"1979-03-10-00"
		},
		"GOES1":{
			"images":6017,
			"startDate":"1978-01-01-06",
			"endDate":"1983-06-01-00"
		},
		"GOES3":{
			"images":11702,
			"startDate":"1978-11-20-18",
			"endDate":"1981-03-05-06"
		},
		"GMS-1":{
			"images":9821,
			"startDate":"1978-12-01-00",
			"endDate":"1984-06-29-12"
		},
		"SMS-2":{
			"images":12434,
			"startDate":"1979-01-01-00",
			"endDate":"1981-08-05-03"
		},
		"GRD-1":{
			"images":220150,
			"startDate":"1980-01-01-00",
			"endDate":"2018-09-18-21"
		},
		"GOES5":{
			"images":13208,
			"startDate":"1980-07-14-00",
			"endDate":"1983-12-31-21"
		},
		"GOES4":{
			"images":9639,
			"startDate":"1980-09-24-15",
			"endDate":"1982-11-26-03"
		},
		"GOE-3":{
			"images":886,
			"startDate":"1981-01-01-03",
			"endDate":"1981-03-05-06"
		},
		"GOE-4":{
			"images":9552,
			"startDate":"1981-03-05-18",
			"endDate":"1982-11-26-03"
		},
		"GOE-5":{
			"images":15836,
			"startDate":"1981-08-05-12",
			"endDate":"1984-07-29-21"
		},
		"MET-2":{
			"images":49034,
			"startDate":"1981-08-24-15",
			"endDate":"1988-08-24-06"
		},
		"GMS-2":{
			"images":7516,
			"startDate":"1981-12-21-03",
			"endDate":"1984-09-27-00"
		},
		"GOE-1":{
			"images":1558,
			"startDate":"1982-12-01-15",
			"endDate":"1983-06-01-00"
		},
		"GOE-6":{
			"images":26565,
			"startDate":"1983-01-01-00",
			"endDate":"1989-01-19-21"
		},
		"GOES6":{
			"images":3010,
			"startDate":"1983-06-01-12",
			"endDate":"1983-12-31-21"
		},
		"GMS-3":{
			"images":23806,
			"startDate":"1984-09-27-06",
			"endDate":"1989-12-04-00"
		},
		"GOE-7":{
			"images":48582,
			"startDate":"1987-02-03-03",
			"endDate":"1996-01-11-12"
		},
		"MET-3":{
			"images":27339,
			"startDate":"1988-08-24-09",
			"endDate":"1995-04-29-12"
		},
		"MET-4":{
			"images":31818,
			"startDate":"1989-06-19-12",
			"endDate":"1994-02-04-06"
		},
		"GMS-4":{
			"images":25992,
			"startDate":"1989-12-04-06",
			"endDate":"1995-06-13-00"
		},
		"MET-5":{
			"images":101745,
			"startDate":"1991-05-02-09",
			"endDate":"2007-04-16-03"
		},
		"MET-6":{
			"images":11640,
			"startDate":"1993-12-06-15",
			"endDate":"2000-01-20-09"
		},
		"GOE-8":{
			"images":68258,
			"startDate":"1994-12-01-18",
			"endDate":"2003-04-01-18"
		},
		"GMS-5":{
			"images":60516,
			"startDate":"1995-06-13-06",
			"endDate":"2003-05-22-00"
		},
		"GOE-9":{
			"images":39841,
			"startDate":"1996-01-01-00",
			"endDate":"2005-10-31-21"
		},
		"MET-7":{
			"images":161517,
			"startDate":"1998-06-01-00",
			"endDate":"2017-04-04-06"
		},
		"GOE-10":{
			"images":71841,
			"startDate":"1998-07-27-00",
			"endDate":"2009-12-01-00"
		},
		"GOE-12":{
			"images":84576,
			"startDate":"2003-03-09-09",
			"endDate":"2013-08-22-21"
		},
		"GOES9":{
			"images":7199,
			"startDate":"2003-05-22-06",
			"endDate":"2004-06-09-15"
		},
		"GOES-12":{
			"images":4,
			"startDate":"2004-05-30-18",
			"endDate":"2004-06-01-09"
		},
		"MSG-1":{
			"images":41615,
			"startDate":"2005-01-01-00",
			"endDate":"2018-11-03-21"
		},
		"MTS-1":{
			"images":42070,
			"startDate":"2005-06-19-00",
			"endDate":"2014-11-28-00"
		},
		"FY2-C":{
			"images":34887,
			"startDate":"2005-07-22-00",
			"endDate":"2009-11-26-21"
		},
		"GOE-11":{
			"images":47727,
			"startDate":"2006-06-20-18",
			"endDate":"2011-12-06-15"
		},
		"MSG-2":{
			"images":48755,
			"startDate":"2007-05-10-09",
			"endDate":"2018-07-11-06"
		},
		"MTS-2":{
			"images":30722,
			"startDate":"2007-06-04-06",
			"endDate":"2015-07-07-00"
		},
		"FY2-E":{
			"images":28680,
			"startDate":"2010-01-14-00",
			"endDate":"2015-06-02-21"
		},
		"GOE-13":{
			"images":66507,
			"startDate":"2010-04-14-21",
			"endDate":"2018-01-08-15"
		},
		"GOE-15":{
			"images":60309,
			"startDate":"2011-12-06-18",
			"endDate":"2018-11-01-21"
		},
		"GOE-14":{
			"images":1032,
			"startDate":"2012-09-24-00",
			"endDate":"2013-06-10-15"
		},
		"MSG-3":{
			"images":44588,
			"startDate":"2013-01-01-00",
			"endDate":"2018-02-20-06"
		},
		"HIM-8":{
			"images":31550,
			"startDate":"2015-07-07-03",
			"endDate":"2018-11-03-21"
		},
		"GOE-16":{
			"images":10614,
			"startDate":"2017-10-22-03",
			"endDate":"2018-11-03-21"
		},
		"HIM-9":{
			"images":130,
			"startDate":"2018-02-13-03",
			"endDate":"2018-10-13-00"
		},
		"MSG-4":{
			"images":8164,
			"startDate":"2018-02-20-09",
			"endDate":"2018-11-03-21"
		}
	}
}
```
