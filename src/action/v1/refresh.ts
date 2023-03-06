/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Refresh
 */

import { BarkAuthenticationToken } from "@barksh/token-node";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { dnsLookupAuthModuleCName, DNS_CNAME_RECORD_NOT_FOUND_SYMBOL } from "../../network/dns/cname";
import { postRefreshV1Proxy } from "../../proxy/v1/post-refresh";

export type RequestBarkRefreshV1Config = {

    readonly refreshToken: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRefreshV1Response = {

    readonly rawAuthenticationToken: string;
    readonly authenticationToken: BarkAuthenticationToken;
};

export const requestBarkRefreshV1 = async (
    target: string,
    config: RequestBarkRefreshV1Config,
): Promise<RequestBarkRefreshV1Response> => {

    const targetHost: string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL = await dnsLookupAuthModuleCName(target, config.overrideTargetHost);

    if (targetHost === DNS_CNAME_RECORD_NOT_FOUND_SYMBOL) {
        throw panic.code(ERROR_CODE.DNS_LOOKUP_FAILED_1, target);
    }

    const refreshResponse = await postRefreshV1Proxy(
        targetHost,
        {
            refreshToken: config.refreshToken,
        },
    );

    const token: BarkAuthenticationToken =
        BarkAuthenticationToken.fromTokenOrThrow(refreshResponse.token);

    return {
        authenticationToken: token,
        rawAuthenticationToken: refreshResponse.token,
    };
};
