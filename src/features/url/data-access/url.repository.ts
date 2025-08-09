import { query } from "#lib/db/db-connection.js";
import type { UrlType} from "#features/url/types.js";
import type { ParamsType } from "#features/url/domain/url-schemas.js";

const urlRepository = {
    async getUrl({ alias, domain }: ParamsType): Promise<UrlType | undefined> {
        console.log(alias, domain)
        const result = await query(
            "SELECT alias, domain, original_url, short_url, click_count FROM url WHERE alias = $1 AND domain = $2",
            [alias, domain]
        )

        return result.rows[0];
    }
}


export default urlRepository