export type TokenPermission = "can_read" | "can_create" | "can_update" | "can_delete";
export type TokenType = {
    id: number,
    user_id: number,
    token_string: string,
    label: string,
    created_at?: string,
    last_used?: string,
    can_create: boolean, 
    can_update: boolean, 
    can_delete: boolean,
    can_read: boolean
}
export type TokenWithUrlType = TokenType & {
    alias: string,
    domain: string
}