/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Public Key
 */

import { PostPublicKeyFetchV1ProxyResponse } from "@barksh/authentication-types";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { dnsLookupAuthModuleCName, DNS_CNAME_RECORD_NOT_FOUND_SYMBOL } from "../../network/dns/cname";
import { postPublicKeyFetchV1Proxy } from "../../proxy/v1/post-public-key-fetch";

export type RequestBarkPublicKeyV1Config = {

    readonly domain: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkPublicKeyV1Response = {

    readonly publicKey: string;
};

export const requestBarkPublicKeyV1 = async (
    targetDomain: string,
    config: RequestBarkPublicKeyV1Config,
): Promise<RequestBarkPublicKeyV1Response> => {

    const targetHost: string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL =
        await dnsLookupAuthModuleCName(targetDomain, config.overrideTargetHost);

    if (targetHost === DNS_CNAME_RECORD_NOT_FOUND_SYMBOL) {
        throw panic.code(ERROR_CODE.DNS_LOOKUP_FAILED_1, targetDomain);
    }

    const publicKeyFetchResponse: PostPublicKeyFetchV1ProxyResponse =
        await postPublicKeyFetchV1Proxy(
            targetHost,
            {
                domain: config.domain,
            },
        );

    return {
        publicKey: publicKeyFetchResponse.publicKey,
    };
};
