/**
 * @author WMXPY
 * @namespace Proxy_V1
 * @description Post Inquiry
 */

import { buildUrlForPostInquiryV1, PostInquiryV1ProxyRequest, PostInquiryV1ProxyResponse } from "@barksh/authentication-types";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import Axios, { AxiosResponse } from "axios";
import { ERROR_CODE } from "../../error/code";
import { panic } from "../../error/panic";

export const postInquiryV1Proxy = async (
    authenticationHost: string,
    config: PostInquiryV1ProxyRequest,
): Promise<PostInquiryV1ProxyResponse> => {

    const path: string = buildUrlForPostInquiryV1(authenticationHost);

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
