module.exports = [
    {
        url: "/add",
        post: {
            summary: "add callRate",
            description: "add callRate",
            parameters: [
                // {
                //     in: "header",
                //     name: "x-access-token",
                //     description: "token to access api",
                //     required: false,
                //     type: "string"
                // },
                {
                    in: "body",
                    name: "body",
                    description: "model of callRate                                                                                  ",
                    required: true,
                    schema: {
                        $ref: "#/definitions/callRateCreate"
                    }
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
        url: "/list",
        get: {
            summary: "callRate list",
            description: "callRate list ",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: true,
                    type: "string"
                },

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