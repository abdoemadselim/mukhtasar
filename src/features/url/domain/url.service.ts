import urlRepository from "#features/url/data-access/url.repository.js";
import { URLNotFoundException } from "#features/url/domain/error-types.js";
import type { ParamsType } from "#features/url/domain/url-schemas.js";
import { UrlType } from "#features/url/types.js";
import generate_id from "#features/url/domain/id-generator.js";

import { ConflictException } from "#lib/error-handling/error-types.js";
import { toBase62 } from "#lib/base-convertor/base-convertor.js";


// Returns the details of a shortened URL
export async function getUrlInfo({ domain, alias }: ParamsType) {
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }
    return url
}

// Create a new short url
export async function createUrl(newUrl: Partial<UrlType>): Promise<UrlType> {
    // check if the original url has a short url already
    const { domain, alias, original_url, user_id, description = "" } = newUrl as UrlType;
    const resolvedDomain = domain || process.env.ORIGINAL_DOMAIN as string;

    // 1. Return existing short URL if original_url already exists
    const existingUrl = await urlRepository.getUrlByOriginalUrl({ original_url });
    if (existingUrl) return existingUrl;


    // 2. If alias is provided, ensure it’s unique
    if (alias) {
        const aliasExists = await urlRepository.getUrlByAlias({ alias });
        if (aliasExists) {
            throw new ConflictException("This alias is not available.");
        }
        return saveUrl({ alias, resolvedDomain, original_url, user_id, description });
    }

    // 3. Generate alias when none is provided

    // 1- generate unique id
    const sequenceNumber = await generate_id();
    const uniqueId = (Number(process.env.MACHINE_ID) || 0) + sequenceNumber;

    // 2- convert to base62
    const uniqueIdBase62 = toBase62(uniqueId)

    // 3- construct new URL record
    return saveUrl({ alias: uniqueIdBase62, resolvedDomain, original_url, user_id, description });
}

export async function deleteUrl({ domain, alias }: ParamsType) {
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }

    await urlRepository.deleteUrl({ alias, domain });
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

    return result;
}

export async function getUrlClickCount({ domain, alias }: ParamsType) {
    //1. Check if the URL even exists to update
    const url = await urlRepository.getUrlByAliasAndDomain({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }
    // 2. Update the existing url
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