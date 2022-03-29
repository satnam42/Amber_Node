module.exports = [
    {
        url: "/add",
        post: {
            summary: "add coin",
            description: "add coin",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: false,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of addCoin                                                                                  ",
                    required: true,
                    schema: {
                        $ref: "#/definitions/addCoin"
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
            summary: "coin list",
            description: "coin list ",
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

    {
        url: "/buy",
        post: {
            summary: "buy coin",
            description: "buy coin",
            parameters: [
                {
                    in: "header",
                    name: "x-access-token",
                    description: "token to access api",
                    required: false,
                    type: "string"
                },
                {
                    in: "body",
                    name: "body",
                    description: "model of buyCoin",
                    required: false,
                    schema: {
                        $ref: "#/definitions/buyCoin"
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
];