// apps/frontend/src/features/contact/hooks/contact-query.ts
import { useMutation } from "@tanstack/react-query";
import { ContactMessageType } from "@mukhtasar/shared";
import { sendContactMessage } from "@/features/contact/service/contact.service";

export function useSendContactMessage() {
    const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
        mutationFn: (data: ContactMessageType) => sendContactMessage(data),
    });

    return { mutateAsync, isError, isPending, isSuccess, error };
}