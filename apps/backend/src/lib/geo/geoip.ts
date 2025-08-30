import { Reader, ReaderModel } from '@maxmind/geoip2-node';
import { countryToArabic, isoCode } from './country-map.js';
import path from "path"
import { fileURLToPath } from "url";

let geoLookup: ReaderModel;

// FIX __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

export async function initGeoIp() {
    if (!geoLookup) {
        geoLookup = await Reader.open(path.join(__dirname, 'GeoLite2-Country.mmdb'));
    }
    return geoLookup;
}

export function getCountry(ip: string): string | undefined {
    if (!geoLookup) {
        throw new Error("GeoIP not initialized. Call initGeoIP() first.");
    }
    const result = geoLookup.country(ip);
    return getCountryNameAr(result?.country?.isoCode as isoCode);
}

function getCountryNameAr(code: isoCode | undefined) {
    if (code) {
        return countryToArabic[code] || code;
    }
}