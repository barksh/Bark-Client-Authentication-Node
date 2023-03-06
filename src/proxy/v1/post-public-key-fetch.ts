/**
 * @author WMXPY
 * @namespace Proxy_V1
 * @description Post Public Key Fetch
 */

import { buildUrlForPostPublicKeyFetchV1, PostPublicKeyFetchV1ProxyRequest, PostPublicKeyFetchV1ProxyResponse } from "@barksh/authentication-types";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import Axios, { AxiosResponse } from "axios";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

export const postPublicKeyFetchV1Proxy = async (
    authenticationHost: string,
    config: PostPublicKeyFetchV1ProxyRequest,
): Promise<PostPublicKeyFetchV1ProxyResponse> => {

    const path: string = buildUrlForPostPublicKeyFetchV1(authenticationHost);

    const response: AxiosResponse = await Axios.post(
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
            response.data,
        );
    }

    return response.data;
};
