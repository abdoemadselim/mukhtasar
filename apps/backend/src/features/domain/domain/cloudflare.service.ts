import { ValidationException } from '#root/lib/error-handling/error-types.js';

// Plain fetch instead of the "cloudflare" SDK: the SDK fails to read response bodies on Node 22 ("Premature close")
const API_BASE = 'https://api.cloudflare.com/client/v4';

type CustomHostname = {
    id: string;
    hostname: string;
    status: string;
    ssl: {
        status: string;
        validation_errors?: unknown[];
    };
};

async function cloudflareRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}/zones/${process.env.CLOUDFLARE_ZONE_ID}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    const body = await response.json() as { success: boolean, result: T, errors?: { message: string }[] };
    if (!response.ok || !body.success) {
        throw new Error(`Cloudflare API error: ${body.errors?.map((e) => e.message).join('; ') || response.status}`);
    }

    return body.result;
}

function toCustomHostname(result: CustomHostname): CustomHostname {
    return {
        id: result.id,
        hostname: result.hostname,
        status: result.status,
        ssl: {
            status: result.ssl?.status,
            validation_errors: result.ssl?.validation_errors,
        },
    };
}

export async function createCustomHostname(hostname: string): Promise<CustomHostname> {
    try {
        const result = await cloudflareRequest<CustomHostname>('/custom_hostnames', {
            method: 'POST',
            body: JSON.stringify({
                hostname,
                ssl: {
                    method: 'http',
                    type: 'dv',
                    settings: {
                        http2: 'on',
                        min_tls_version: '1.2',
                        tls_1_3: 'on',
                    },
                },
            }),
        });

        return toCustomHostname(result);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new ValidationException({ domain: { message: ".حدثت مشكلة أثناء إضافة النطاق - برجاء المحاولة مرة اخرى مع التأكد من صلاحية النطاق" } })
    }
}

export async function getCustomHostnameStatus(hostnameId: string): Promise<CustomHostname> {
    const result = await cloudflareRequest<CustomHostname>(`/custom_hostnames/${hostnameId}`);
    return toCustomHostname(result);
}

export async function deleteCustomHostname(hostnameId: string): Promise<void> {
    await cloudflareRequest(`/custom_hostnames/${hostnameId}`, { method: 'DELETE' });
}
