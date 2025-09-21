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
        const verification = await verifyDomainCNAME(
            domain.domain,
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

    return createdDomain;
}

export async function verifyDomainCNAME(domain: string, expectedTarget: string) {
    try {
        // user domain: go.minimoapp.pro 
        // CNAME go.minimoapp.pro ---content---> domains.mukhtasar.pro
        console.log(domain);
        const records = await dns.resolveNs(domain);

        console.log(records)
        // Check if any CNAME record matches our expected target
        const isValid = records.some(record =>
            record.toLowerCase() === expectedTarget.toLowerCase()
        );

        return {
            isValid,
            records,
            timestamp: new Date(),
            error: null
        };
    } catch (error: any) {
        // DNS resolution failed
        return {
            isValid: false,
            records: [],
            error: error.message,
            timestamp: new Date()
        };
    }
}

function getDomainTarget() {
    return process.env.DOMAIN_TARGET || 'domains.mukhtasar.pro';
}

export async function checkAndUpdateDomainStatus(domainId: number, domain: string) {
    const targetDomain = getDomainTarget();
    const verification = await verifyDomainCNAME(domain, targetDomain);

    const newStatus = verification.isValid ? 'active' : 'failed';

    return {
        status: newStatus,
        verification: verification,
        lastChecked: new Date()
    };
}

export async function refreshDomain(user_id: number, domainId: number) {
    // Verify user owns the domain
    const domain = await domainRepository.getDomainById(domainId);
    if (!domain || domain.user_id !== user_id) {
        throw new ValidationException({ domain: { message: "النطاق غير موجود." } });
    }

    const targetDomain = getDomainTarget();

    // Verify CNAME
    const verification = await verifyDomainCNAME(
        domain.domain,
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