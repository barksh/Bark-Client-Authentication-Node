/**
 * @author WMXPY
 * @namespace Action_V1
 * @description Redeem
 */

import { BarkRefreshToken } from "@barksh/token-node";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";
import { dnsLookupAuthModuleCName, DNS_CNAME_RECORD_NOT_FOUND_SYMBOL } from "../../network/dns/cname";
import { postRedeemV1Proxy } from "../../proxy/v1/post-redeem";

export type RequestBarkRedeemV1Config = {

    readonly hiddenKey: string;

    readonly overrideTargetHost?: string;
};

export type RequestBarkRedeemV1Response = {

    readonly rawRefreshToken: string;
    readonly refreshToken: BarkRefreshToken;
};

export const requestBarkRedeemV1 = async (
    target: string,
    config: RequestBarkRedeemV1Config,
): Promise<RequestBarkRedeemV1Response> => {

    const targetHost: string | typeof DNS_CNAME_RECORD_NOT_FOUND_SYMBOL =
        await dnsLookupAuthModuleCName(target, config.overrideTargetHost);

    if (targetHost === DNS_CNAME_RECORD_NOT_FOUND_SYMBOL) {
        throw panic.code(ERROR_CODE.DNS_LOOKUP_FAILED_1, target);
    }

    const redeemResponse = await postRedeemV1Proxy(
        targetHost,
        {
            hiddenKey: config.hiddenKey,
        },
    );

    const token: BarkRefreshToken = BarkRefreshToken.fromTokenOrThrow(redeemResponse.refreshToken);

    return {
        rawRefreshToken: redeemResponse.refreshToken,
        refreshToken: token,
    };
};
