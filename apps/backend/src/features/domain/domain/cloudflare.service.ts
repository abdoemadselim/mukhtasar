import Cloudflare from 'cloudflare/index.js';

const cloudflareClient = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

export async function createCustomHostname(hostname: string): Promise<Cloudflare.CustomHostnames.CustomHostnameCreateResponse> {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID as string;

    const response = await cloudflareClient.customHostnames.create({
        zone_id: zoneId,
        hostname,
        ssl: {
            method: 'http',
            type: 'dv',
            settings: {
                http2: 'on',
                min_tls_version: '1.2',
                tls_1_3: 'on'
            }
        },
    });

    return {
        id: response.id,
        hostname: response.hostname,
        status: response.status,
        ssl: {
            status: response.ssl.status,
            validation_errors: response.ssl.validation_errors
        }
    };
}

// export async function getCustomHostnameStatus(hostnameId: string): Promise<CloudflareCustomHostname> {
//     const zoneId = process.env.CLOUDFLARE_ZONE_ID as string;

//     try {
//         const response = await cloudflare.customHostnames.get(zoneId, hostnameId);

//         return {
//             id: response.result.id,
//             hostname: response.result.hostname,
//             status: response.result.status as any,
//             ssl: {
//                 status: response.result.ssl.status as any,
//                 validation_errors: response.result.ssl.validation_errors
//             }
//         };
//     } catch (error: any) {
//         throw new Error(`Failed to get custom hostname status: ${error.message}`);
//     }
// }

// export async function deleteCustomHostname(hostnameId: string): Promise<void> {
//     const zoneId = process.env.CLOUDFLARE_ZONE_ID as string;

//     try {
//         await cloudflare.customHostnamesForAZone.delete(zoneId, hostnameId);
//     } catch (error: any) {
//         throw new Error(`Failed to delete custom hostname: ${error.message}`);
//     }
// }