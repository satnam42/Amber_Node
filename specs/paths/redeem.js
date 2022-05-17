module.exports = [
    {
        url: "/create",
        post: {
            summary: "create",
            description: "create",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of  redeem",
                    required: true,
                    schema: {
                        $ref: "#/definitions/redeem"
                    }
                }],
            responses: {
                default: {
                    description: "Unexpected error",
                    schema: {
                        $ref: "#/definitions/Error"
                    }
                }
            }
        }
    },
    {
        url: "/request",
        post: {
            summary: "request for redeem",
            description: "request for redeem",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of  request",
                    required: true,
                    schema: {
                        $ref: "#/definitions/request"
                    }
                }],
            responses: {
                default: {
                    description: "Unexpected error",
                    schema: {
                        $ref: "#/definitions/Error"
                    }
                }
            }
        }
    },
    {
        url: "/allRequestList",
        get: {
            summary: "Request List",
            description: "Request List",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },
                // {
                //     in: "query",
                //     type: "integer",
                //     name: "pageNo",
                //     description: "pageNo",
                //     required: true
                // },
                // {
                //     in: "query",
                //     type: "integer",
                //     name: "pageSize",
                //     description: "pageSize",
                //     required: true
                // },

            ],
            responses: {
                default: {
                    description: "Unexpected error",
                    schema: {
                        $ref: "#/definitions/Error"
                    }
                }
            }
        }
    },
    {
        url: "/checkRequestStatus/{id}",
        put: {
            summary: "checkRequestStatus",
            description: "checkRequestStatus",
            parameters: [

                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },
                {
                    in: "path",
                    type: "string",
                    name: "id",
                    description: "request id",
                    required: true
                }
            ],
            responses: {
                default: {
                    description: "Unexpected error",
                    schema: {
                        $ref: "#/definitions/Error"
                    }
                }
            }
        }
    },
    {
        url: "/requestListByUserId/{id}",
        put: {
            summary: "requestListByUserId",
            description: "requestListByUserId",
            parameters: [

                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },
                {
                    in: "path",
                    type: "string",
                    name: "id",
                    description: "user id",
                    required: true
                }
            ],
            responses: {
                default: {
                    description: "Unexpected error",
                    schema: {
                        $ref: "#/definitions/Error"
                    }
                }
            }
        }
    },



];