import { createCustomHostname } from './cloudflare.service.js';
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

    for (const domain of domains) {
        // Check CNAME for each domain
        const verification = await verifyDomainRecord(
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
        } else {
            updatedDomains.push({ ...domain });
        }
    }

    return updatedDomains;
}

export async function getUserActiveDomains(user_id: number) {
    const domains = await domainRepository.getUserActiveDomains(user_id);
    return domains;
}

export async function addDomain({ domain, user_id }: { domain: string, user_id: number }) {
    // 1. Check if domain already exists
    const existingDomain = await domainRepository.checkDomainExists(domain);
    if (existingDomain) {
        throw new ValidationException({ domain: { message: "هذا النطاق مستخدم بالفعل." } });
    }

    // 2. Create custom hostname in Cloudflare
    const cloudflareHostname = await createCustomHostname(domain.toLowerCase());

    // 3. Create the domain in database with Cloudflare ID
    const createdDomain = await domainRepository.addDomain({
        domain: domain.toLowerCase(),
        userId: user_id,
        cloudflare_hostname_id: cloudflareHostname.id
    });

    return {
        id: createdDomain.id,
        status: createdDomain.status,
        ssl_status: cloudflareHostname.ssl.status,
        domain_target: process.env.FALLBACK_ORIGIN
    };
}

export async function verifyDomainRecord(domain: string, expectedTarget: string) {
    try {
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
    } catch (error: any) {
        // DNS resolution failed
        return {
            isValid: false,
            records: [],
            error: error.message,
            timestamp: new Date(),
        };
    }
}

function getDomainTarget() {
    return process.env.FALLBACK_ORIGIN || 'domains.mukhtasar.pro';
}

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

export async function deleteDomain(user_id: number, domainId: number) {
    // Verify user owns the domain
    const domain = await domainRepository.getDomainById(domainId);
    if (!domain || domain.user_id !== user_id) {
        throw new ValidationException({ domain: { message: "النطاق غير موجود." } });
    }

    // Delete the domain
    const deletedDomain = await domainRepository.deleteDomain({
        domainId: domain.id,
        userId: user_id
    });

    if (!deletedDomain) {
        throw new ValidationException({ domain: { message: "فشل في حذف النطاق." } });
    }

    return deletedDomain;
}

