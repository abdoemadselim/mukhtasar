import { apiClient } from "@/lib/api-client";
import { TokenType } from "@mukhtasar/shared";

export async function createToken(data: TokenType) {
  return apiClient.post("/token", data, {
    includeCredentials: true, // يرسل الكوكيز تلقائيًا
    throwOnError: true, // يرمي errors بدل ما يرجع object
  });
}

export async function getTokens({
  page = 1,
  page_size = 10,
}: {
  page: number;
  page_size: number;
}) {
  const realPage = page > 0 ? page : 1;
  const endpoint = `/token?page=${realPage - 1}&pageSize=${page_size}`;

  return apiClient.get(endpoint, {
    cache: "no-store",
    throwOnError: true,
  });
}

export async function deleteToken(token_id: number) {
  return apiClient.delete(`/token/${token_id}`, {
    cache: "no-store",
    throwOnError: true,
  });
}

export async function updateToken({ id, can_create, can_update, can_delete, label }: Partial<TokenType> & { id: number }) {
  const toUpdateResource = {
    can_create,
    can_update,
    can_delete,
    label
  }

  return apiClient.patch(`/token/${id}`, toUpdateResource, {
    cache: "no-store",
    throwOnError: true,
  });
}