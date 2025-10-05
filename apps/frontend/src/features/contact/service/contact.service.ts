import { ContactMessageType } from "@mukhtasar/shared";
import { apiClient } from "@/shared/lib/api-client";

export async function sendContactMessage(data: ContactMessageType) {
    return apiClient.post('/contact/message', data, {
        throwOnError: true
    });
}