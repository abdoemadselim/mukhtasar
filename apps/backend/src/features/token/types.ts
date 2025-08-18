export type TokenPermission = "can_read" | "can_create" | "can_update" | "can_delete";

export type TokenInput = {
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    label: string;
    user_id: string;
};

export type Token = TokenInput & {
    id: string;
    created_at: Date;
};

export type TokenWithUrlType = Token & {
    alias: string,
    domain: string
}

