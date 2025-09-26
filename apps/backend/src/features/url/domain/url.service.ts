
import type { ParamsType } from "@mukhtasar/shared";

import urlRepository from "#features/url/data-access/url.repository.js";
import { URLNotFoundException } from "#features/url/domain/error-types.js";
import { UrlInputType, UrlType } from "#features/url/types.js";
import generate_id from "#features/url/domain/id-generator.js";
import domainRepository from "#features/domain/data-access/domain-repository.js";

import { ConflictException, ValidationException } from "#lib/error-handling/error-types.js";
import { toBase62 } from "#lib/base-convertor/base-convertor.js";
import { client as redisClient } from "#lib/db/redis-connection.js"

// Returns the details of a shortened URL
export async function getUrlInfo({ domain, alias }: ParamsType) {
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });

    if (!url) {
        throw new URLNotFoundException();
    }
    return url
}

export async function createUrl(newUrl: Partial<UrlType>): Promise<Partial<UrlType & { is_temporary: boolean }>> {
    const { domain, alias, original_url, user_id, description = "" } = newUrl as UrlInputType;

    // 1- Domain authorization logic
    const originalDomain = process.env.ORIGINAL_DOMAIN as string;
    let resolvedDomain = domain || originalDomain;

    if (!user_id) {
        // Guest users can only use the original domain
        if (domain && domain !== originalDomain) {
            throw new ValidationException({ domain: { message: "لا يمكنك استخدام هذا النطاق." } })
        }
        resolvedDomain = originalDomain;
    } else {
        // Authenticated users can use original domain or their own domains
        if (domain && domain !== originalDomain) {
            const userOwnsDomain = await domainRepository.checkUserOwnsDomain({ userId: user_id, domain });
            if (!userOwnsDomain) {
                throw new ValidationException({ domain: { message: "لا يمكنك استخدام هذا النطاق." } })
            }
        }
    }

    // 2. If alias is provided, ensure it's unique
    if (alias) {
        createUrlWithAlias({ alias, resolvedDomain, original_url, user_id, description })
    }

    // 3. Generate alias when none is provided
    const uniqueId = await generate_id();
    const uniqueIdBase62 = toBase62(uniqueId);

    // Create temporary URL for guest users, permanent for authenticated users
    if (!user_id) {
        return saveTemporaryUrl({ alias: uniqueIdBase62, resolvedDomain, original_url });
    } else {
        return saveUrl({ alias: uniqueIdBase62, resolvedDomain, original_url, user_id, description });
    }
}

async function createUrlWithAlias({
    alias,
    resolvedDomain,
    original_url,
    user_id,
    description }: {
        alias: string;
        resolvedDomain: string;
        original_url: string;
        user_id: number;
        description: string;
    }) {
    // Check both permanent URLs and temporary URLs
    const aliasExists = await urlRepository.getUrlByAliasAndDomain({ alias, domain: resolvedDomain });
    const tempUrlExists = await redisClient.get(`temp_url:${resolvedDomain}-${alias}`);

    if (aliasExists || tempUrlExists) {
        throw new ConflictException("هذا الاسم المستعار غير متوفر.");
    }

    // Create temporary URL for guest users, permanent for authenticated users
    if (!user_id) {
        return saveTemporaryUrl({ alias, resolvedDomain, original_url });
    } else {
        return saveUrl({ alias, resolvedDomain, original_url, user_id, description });
    }
}

async function saveUrl({
    alias,
    resolvedDomain,
    original_url,
    user_id,
    description }: {
        alias: string;
        resolvedDomain: string;
        original_url: string;
        user_id: number;
        description: string;
    }) {
    const createdUrl = await urlRepository.createUrl({
        alias,
        domain: resolvedDomain,
        original_url,
        user_id,
        description
    });

    redisClient.setEx(`url:${resolvedDomain}-${alias}`, 86400 * 3, original_url);

    return {
        alias,
        domain: resolvedDomain,
        original_url,
        description,
        created_at: createdUrl.created_at,
        short_url: createdUrl.short_url
    };
}

async function saveTemporaryUrl({
    alias,
    resolvedDomain,
    original_url,
}: {
    alias: string;
    resolvedDomain: string;
    original_url: string;
}) {
    const short_url = `https://${resolvedDomain}/${alias}`;

    await redisClient.setEx(`temp_url:${resolvedDomain}-${alias}`, 300, original_url); // 5 minutes = 300 seconds

    return {
        alias,
        domain: resolvedDomain,
        original_url,
        short_url,
        is_temporary: true
    };
}

export async function deleteUrl({ domain, alias }: ParamsType) {
    // 1. Check if url exists
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }

    // 2. Delete url from DB
    await urlRepository.deleteUrl({ alias, domain });

    // 3. Remove from Redis as well if exists
    redisClient.del(`url:${domain}-${alias}`);
    return url;
}

export async function updateUrl({ domain, alias }: ParamsType, original_url: string) {
    //1. Check if the URL even exists to update
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }

    if (url.original_url == original_url) {
        return original_url;
    }

    // 2. Update the existing url
    const result = await urlRepository.updateUrl({ alias, domain }, original_url)

    // 3. Delete Redis Entry
    redisClient.del(`url:${domain}-${alias}`);

    return result;
}

export async function getUrlClickCount({ domain, alias }: ParamsType) {
    // 1. Check if the URL even exists
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }
    // 2. Get the click count of url
    const result = await urlRepository.getUrlClickCounts({ alias, domain })

    return result;
}

export async function getOriginalUrl({ domain, alias }: { domain: string, alias: string }) {
    // First, check if it's a temporary URL in Redis (Not Logged-in Users)
    const tempUrl = await redisClient.get(`temp_url:${domain}-${alias}`);
    if (tempUrl) {
        return tempUrl;
    }

    console.log(tempUrl)

    // Then check permanent URLs (Logged-in Users)
    let url = await redisClient.get(`url:${domain}-${alias}`);

    if (!url) {
        const record = await urlRepository.getUrlByAliasAndDomain({ domain, alias });

        if (!record) throw new URLNotFoundException();

        url = record.original_url;
        redisClient.setEx(`url:${domain}-${alias}`, 86400 * 3, url);
    }

    return url;
}

export async function getUrlsPage({ user_id, page, page_size }: { user_id: number, page: number, page_size: number }) {
    const { urls, total } = await urlRepository.getUrlsPage({ user_id, page, page_size });
    return { urls, total };
}