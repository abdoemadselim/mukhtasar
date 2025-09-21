import dns from 'dns/promises';

import domainRepository from "#features/domain/data-access/domain-repository.js";
import { ValidationException } from "#lib/error-handling/error-types.js";

export async function getUserDomains(user_id: number) {
    const domains = await domainRepository.getUserDomains(user_id);
    if (domains.length === 0) {
        return domains;
    }

    const targetDomain = getDomainTarget();
    const updatedDomains = [];
    updatedDomains.push(...domains)

    for (const domain of domains) {
        // Check CNAME for each domain
        const verification = await verifyDomainRecord(
            domain.domain,
            domain.domain_type,
            targetDomain
        );

        const newStatus = verification.isValid ? 'active' :
            (domain.status === 'active' || domain.status === 'pending' ? 'failed' : domain.status);

        // Update status if changed
        if (newStatus !== domain.status) {
            const updated = await domainRepository.updateDomainStatus({
                domainId: domain.id,
                status: newStatus
            });
            updatedDomains.push({ ...domain, status: newStatus, updated_at: updated.updated_at });
        }
    }

    return updatedDomains;
}

export async function addDomain({ domain, user_id, domain_type }: { domain: string, user_id: number, domain_type: string }) {
    // 1. Check if domain already exists (globally)
    const existingDomain = await domainRepository.checkDomainExists(domain);
    if (existingDomain) {
        throw new ValidationException({ domain: { message: "هذا النطاق مستخدم بالفعل." } });
    }

    // 2. Validate domain_type
    if (!['domain', 'subdomain'].includes(domain_type)) {
        throw new ValidationException({ domain_type: { message: "نوع النطاق غير صالح." } });
    }

    // 2. Create the domain with pending status
    const createdDomain = await domainRepository.addDomain({
        domain: domain.toLowerCase(),
        userId: user_id,
        domainType: domain_type
    });

    return createdDomain;
}

export async function verifyDomainRecord(domain: string, domainType: string, expectedTarget: string) {
    try {
        if (domainType === 'domain') {
            // For root domains, check A records
            const records = await dns.resolve4(domain);
            const expectedIP = process.env.SERVER_IP || '167.99.123.456'; // Your server IP

            const isValid = records.some(record =>
                record === expectedIP
            );

            return {
                isValid,
                records,
                timestamp: new Date(),
                error: null,
                recordType: 'A'
            };
        } else {
            // For subdomains, check CNAME records
            const records = await dns.resolveCname(domain);

            const isValid = records.some(record =>
                record.toLowerCase() === expectedTarget.toLowerCase()
            );

            return {
                isValid,
                records,
                timestamp: new Date(),
                error: null,
                recordType: 'CNAME'
            };
        }
    } catch (error: any) {
        // DNS resolution failed
        return {
            isValid: false,
            records: [],
            error: error.message,
            timestamp: new Date(),
            recordType: domainType === 'domain' ? 'A' : 'CNAME'
        };
    }
}

function getDomainTarget() {
    return process.env.DOMAIN_TARGET || 'domains.mukhtasar.pro';
}

// export async function checkAndUpdateDomainStatus(domainId: number, domain: string) {
//     const targetDomain = getDomainTarget();
//     const verification = await verifyDomainRecord(domain, domain.domain_type, targetDomain);

//     const newStatus = verification.isValid ? 'active' : 'failed';

//     return {
//         status: newStatus,
//         verification: verification,
//         lastChecked: new Date()
//     };
// }

export async function refreshDomain(user_id: number, domainId: number) {
    // Verify user owns the domain
    const domain = await domainRepository.getDomainById(domainId);
    if (!domain || domain.user_id !== user_id) {
        throw new ValidationException({ domain: { message: "النطاق غير موجود." } });
    }

    const targetDomain = getDomainTarget();

    // Verify CNAME
    const verification = await verifyDomainRecord(
        domain.domain,
        domain.domain_type,
        targetDomain
    );

    const newStatus = verification.isValid ? 'active' : 'failed';

    // Update domain status
    const updatedDomain = await domainRepository.updateDomainStatus({
        domainId: domain.id,
        status: newStatus
    });

    return {
        id: domain.id,
        domain: domain.domain,
        status: newStatus,
        verification: verification,
        updated_at: updatedDomain.updated_at
    };
}