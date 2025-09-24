import Cloudflare from 'cloudflare/index.js';

const cloudflareClient = new Cloudflare({
    apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

export async function createCustomHostname(hostname: string): Promise<Cloudflare.CustomHostnames.CustomHostnameCreateResponse> {
    const zone_id = process.env.CLOUDFLARE_ZONE_ID as string;

    const response = await cloudflareClient.customHostnames.create({
        zone_id,
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

export async function getCustomHostnameStatus(hostnameId: string): Promise<Cloudflare.CustomHostnames.CustomHostnameGetResponse> {
    const zone_id = process.env.CLOUDFLARE_ZONE_ID as string;

    const response = await cloudflareClient.customHostnames.get(hostnameId, {
        zone_id
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

export async function deleteCustomHostname(hostnameId: string): Promise<void> {
    const zone_id = process.env.CLOUDFLARE_ZONE_ID as string;

    await cloudflareClient.customHostnames.delete(hostnameId, {
        zone_id
    });
}