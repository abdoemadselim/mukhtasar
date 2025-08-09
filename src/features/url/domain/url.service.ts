import urlRepository from "#features/url/data-access/url.repository.js";
import { URLNotFoundException } from "#features/url/domain/error-types.js";
import type { ParamsType } from "#features/url/domain/url-schemas.js";

// Returns the details of a shortened URL
export async function getUrl({ domain, alias }: ParamsType) {
    // Rate limiting


    // Validate API token

    const url = await urlRepository.getUrl({ alias, domain });
    if (!url) {
        throw new URLNotFoundException();
    }
    return url
}