/**
 * @author WMXPY
 * @namespace Proxy_V1
 * @description Post Redeem
 */

import { buildUrlForPostRedeemV1, PostRedeemV1ProxyRequest, PostRedeemV1ProxyResponse } from "@barksh/authentication-types";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import Axios from "axios";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

export const postRedeemV1Proxy = async (
    authenticationHost: string,
    config: PostRedeemV1ProxyRequest,
): Promise<PostRedeemV1ProxyResponse> => {

    const path: string = buildUrlForPostRedeemV1(authenticationHost);

    const response: Response = await Axios.post(
        path,
        config,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    if (response.status !== HTTP_RESPONSE_CODE.OK) {
        throw panic.code(
            ERROR_CODE.REQUEST_FAILED_1,
            await response.json(),
        );
    }

    return await response.json();
};
