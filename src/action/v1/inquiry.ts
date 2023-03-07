/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Inquiry
 */

import { InquiryAction } from "@barksh/authentication-types";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { dnsLookupAuthModuleCName, dnsLookupAuthUICName, DNS_CNAME_RECORD_NOT_FOUND_SYMBOL } from "../../network/dns/cname";
import { postInquiryV1Proxy } from "../../proxy/v1/post-inquiry";

export type RequestBarkInquiryV1Config = {

    readonly domain: string;
    readonly actions?: InquiryAction[];

    readonly overrideTargetHost?: string;
    readonly overrideTargetUIHost?: string;
};

export type RequestBarkInquiryV1Response = {

    readonly exposureKey: string;
    readonly hiddenKey: string;
    readonly redirectUrl: string;
};

export const requestBarkInquiryV1 = async (
    target: string,
    config: RequestBarkInquiryV1Config,
): Promise<RequestBarkInquiryV1Response> => {

    const targetHost: string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL =
        await dnsLookupAuthModuleCName(target, config.overrideTargetHost);
    const targetUIHost: string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL =
        await dnsLookupAuthUICName(target, config.overrideTargetUIHost);

    if (targetHost === DNS_CNAME_RECORD_NOT_FOUND_SYMBOL) {
        throw panic.code(ERROR_CODE.DNS_LOOKUP_FAILED_1, target);
    }

    if (targetUIHost === DNS_CNAME_RECORD_NOT_FOUND_SYMBOL) {
        throw panic.code(ERROR_CODE.DNS_LOOKUP_FAILED_1, target);
    }

    const inquiryResponse = await postInquiryV1Proxy(
        targetHost,
        {
            domain: config.domain,
            actions: config.actions,
        },
    );

    return {
        exposureKey: inquiryResponse.exposureKey,
        hiddenKey: inquiryResponse.hiddenKey,
        redirectUrl: `${targetUIHost}?key=${inquiryResponse.exposureKey}`,
    };
};
