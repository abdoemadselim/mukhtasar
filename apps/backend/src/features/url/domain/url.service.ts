import urlRepository from "#root/features/url/data-access/url.repository.js";
import type { ParamsType } from "@mukhtasar/shared";

import { URLNotFoundException } from "#features/url/domain/error-types.js";
import { UrlInputType, UrlType } from "#features/url/types.js";
import generate_id from "#features/url/domain/id-generator.js";

import { ConflictException } from "#lib/error-handling/error-types.js";
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

// Create a new short url
export async function createUrl(newUrl: Partial<UrlType>): Promise<Partial<UrlType>> {
    // check if the original url has a short url already
    const { domain, alias, original_url, user_id, description = "" } = newUrl as UrlInputType;
    const resolvedDomain = domain || process.env.ORIGINAL_DOMAIN as string;

    // 1. Return existing short URL if original_url already exists
    // const existingUrl = await urlRepository.getUrlByOriginalUrl({ original_url });
    // if (existingUrl) throw new ConflictException("Original url already exists")

    // 2. If alias is provided, ensure it’s unique
    if (alias) {
        const aliasExists = await urlRepository.getUrlByAlias(alias);
        if (aliasExists) {
            throw new ConflictException("هذا الاسم المستعار غير متوفر.");
        }
        return saveUrl({ alias, resolvedDomain, original_url, user_id, description });
    }

    // 3. Generate alias when none is provided

    // 3.1- generate unique id
    const uniqueId = await generate_id();

    // 3.2- convert to base62 for readable URLs
    const uniqueIdBase62 = toBase62(uniqueId)

    // 3.3- construct new URL record
    return saveUrl({ alias: uniqueIdBase62, resolvedDomain, original_url, user_id, description });
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
    redisClient.del(`url:${alias}`);
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
    redisClient.del(`url:${alias}`);

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

    return {
        alias,
        domain: resolvedDomain,
        original_url,
        user_id,
        description,
        created_at: createdUrl.created_at,
        short_url: createdUrl.short_url
    };
}

export async function getOriginalUrl(alias: string) {
    // First, check if the alias URL is in Redis
    const url = await redisClient.get(`url:${alias}`);

    // If not found in Redis, fetch from the database and store in Redis
    if (!url) {
        // @ts-ignore
        const url = await urlRepository.getUrlByAlias(alias);

        if (!url) throw new URLNotFoundException();
        redisClient.setEx(`url:${alias}`, 86400, url.original_url); // Cache in Redis for future requests
        updateAnalytics(alias)

        return url.original_url
        // @ts-ignore

    }

    updateAnalytics(alias)

    return url;
}

async function updateAnalytics(alias: string) {
    // Increment the click count in Redis (use a counter for clicks)
    await redisClient.incr(`clicks:${alias}`);

    // Store this URL in a sorted set of most used URLs (sorted by click count)
    // TODO: a cron job should be added to sync db with redis
    const clicks = await redisClient.get(`clicks:${alias}`);
    await redisClient.zAdd('top_urls', {
        score: Number(clicks), // Click count as score
        value: alias
    });

    // Limit the top URLs set to 1000 URLs (remove the last url in the sorted set (1001))
    await redisClient.zRemRangeByRank('top_urls', 1000, -1);
}

export async function getUrlsPage({ user_id, page, page_size }: { user_id: number, page: number, page_size: number }) {
    const {urls, total} = await urlRepository.getUrlsPage({ user_id, page, page_size });
    return { urls, total };
}