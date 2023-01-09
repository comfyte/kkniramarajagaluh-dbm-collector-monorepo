import puppeteer from 'puppeteer';

import type { VercelApiHandler } from '@vercel/node';

const endpoint: VercelApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }

    // if (req.body)
    const { lat, lon, carrier_name, dbm } = req.body;

    if (req.headers['content-type'] !== 'application/json' || !lat || !lon || !carrier_name || !dbm) {
        res.status(400).end();
        return;
    }

    
    try {
        const prefilledGFormsUrl = (
            'https://docs.google.com/forms/d/e/1FAIpQLSe8ofQ3pb2RWAqMv_9gRZOzGpxBcBoyR3zU-RASJyyEzK5kXg/viewform' +
            '?usp=pp_url' +
            `&entry.1942559540=${encodeURIComponent(lat)}` +
            `&entry.858639479=${encodeURIComponent(lon)}` +
            `&entry.680016139=${encodeURIComponent(carrier_name)}` +
            `&entry.1518391315=${encodeURIComponent(dbm)}`
        );

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto(prefilledGFormsUrl);
        await page.click('[role=button]');

        await page.waitForFunction('document.querySelector("body").innerText.includes("Your response has been recorded");');

        res.status(200).end();
    }
    catch (err) {
        throw err;
    }
};

export default endpoint;
