import { createCustomHostname, deleteCustomHostname, getCustomHostnameStatus } from './cloudflare.service.js';
import dns from 'dns/promises';

import domainRepository from "#features/domain/data-access/domain-repository.js";
import { ValidationException } from "#lib/error-handling/error-types.js";
import { log, LOG_TYPE } from '#root/lib/logger/logger.js';

export async function getUserDomains(user_id: number) {
    const domains = await domainRepository.getUserDomains(user_id);
    if (domains.length === 0) {
        return domains;
    }
    const updatedDomains = [];

    for (const domain of domains) {
        // Check Cloudflare status for custom hostnames
        try {
            const domain_status = await getCustomHostnameStatus(domain.cloudflare_hostname_id);
            const newStatus = domain_status.status === 'pending' ? 'pending' :
                domain_status.ssl.status !== 'active' ? "ssl_pending" : "active"
            if (newStatus !== domain.status) {
                const updated = await domainRepository.updateDomainStatus({
                    domainId: domain.id,
                    status: newStatus,
                });
                updatedDomains.push({ ...domain, status: newStatus, updated_at: updated.updated_at });
            } else {
                updatedDomains.push({ ...domain });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            await domainRepository.updateDomainStatus({
                domainId: domain.id,
                status: "failed",
            });
            updatedDomains.push({ ...domain, status: "failed" })
            log(LOG_TYPE.INFO, { message: "Custom domain failed", stack: error.stack })
        }
    }
    return updatedDomains;
}

export async function getUserActiveDomains(user_id: number) {
    const all_custom_domains = await getUserDomains(user_id)
    const active_domains = all_custom_domains.filter((domain) => domain.status === "active");
    return active_domains;
}

export async function addDomain({ domain, user_id }: { domain: string, user_id: number }) {
    // 1. Check if domain exists
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

export async function refreshDomain(user_id: number, domainId: number) {
    // Verify user owns the domain
    const domain = await domainRepository.getDomainById(domainId);
    if (!domain || domain.user_id !== user_id) {
        throw new ValidationException({ domain: { message: "هذا النطاق غير موجود." } });
    }

    try {
        // Check status in Cloudflare
        const domain_status = await getCustomHostnameStatus(domain.cloudflare_hostname_id);

        const newStatus = domain_status.status === 'pending' ? 'pending' :
            domain_status.ssl.status !== 'active' ? "ssl_pending" : "active"
        // Update domain status
        await domainRepository.updateDomainStatus({
            domainId: domain.id,
            status: newStatus,
        });

        return {
            id: domain.id,
            domain: domain.domain,
            status: newStatus,
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
        throw new ValidationException({ domain: { message: `فشل في تحديث النطاق.` } });
    }
}

export async function deleteDomain(user_id: number, domainId: number) {
    // Verify user owns the domain
    const domain = await domainRepository.getDomainById(domainId);
    if (!domain || domain.user_id !== user_id) {
        throw new ValidationException({ domain: { message: "النطاق غير موجود." } });
    }

    // Delete from Cloudflare if it exists
    if (domain.cloudflare_hostname_id) {
        await deleteCustomHostname(domain.cloudflare_hostname_id);
    }

    // Delete from database
    const deletedDomain = await domainRepository.deleteDomain({
        domainId: domain.id,
        userId: user_id
    });

    if (!deletedDomain) {
        throw new ValidationException({ domain: { message: "فشل في حذف النطاق." } });
    }

    return deletedDomain;
}
