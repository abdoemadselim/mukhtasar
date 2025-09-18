import domainRepository from "#features/domain/data-access/domain-repository.js";
import { ValidationException } from "#lib/error-handling/error-types.js";

export async function getUserDomains(user_id: number) {
    const domains = await domainRepository.getUserDomains(user_id);
    return domains;
}

export async function addDomain({ domain, user_id }: { domain: string, user_id: number }) {
    // 1. Check if domain already exists (globally)
    const existingDomain = await domainRepository.checkDomainExists(domain);
    if (existingDomain) {
        throw new ValidationException({ domain: { message: "هذا النطاق مستخدم بالفعل." } });
    }

    // 2. Create the domain with pending status
    const createdDomain = await domainRepository.addDomain({
        domain: domain.toLowerCase(),
        userId: user_id
    });

    // 3. TODO: Add to DNS verification queue (for background processing)
    // This could be a Redis queue, database queue, or message queue
    // await addToVerificationQueue(createdDomain.id, domain);

    return createdDomain;
}