/**
 * @author WMXPY
 * @namespace Proxy_V1
 * @description Post Refresh
 */

import { buildUrlForPostRefreshV1, PostRefreshV1ProxyRequest, PostRefreshV1ProxyResponse } from "@barksh/authentication-types";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import Axios, { AxiosResponse } from "axios";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

export const postRefreshV1Proxy = async (
    authenticationHost: string,
    config: PostRefreshV1ProxyRequest,
): Promise<PostRefreshV1ProxyResponse> => {

    const path: string = buildUrlForPostRefreshV1(authenticationHost);

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
