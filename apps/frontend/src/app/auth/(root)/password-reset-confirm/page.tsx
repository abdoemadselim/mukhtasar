import PasswordResetConfirmForm from "@/features/auth/components/password-reset-confirm-form";

export default async function PasswordResetConfirmPage({
    searchParams,
}: {
    searchParams: Promise<{ token: string }>
}) {
    const token = (await searchParams).token
    return (
        <PasswordResetConfirmForm token={token} />
    )
}
