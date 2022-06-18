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
                    description: "model of addCoin ",
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
                {
                    in: "query",
                    type: "integer",
                    name: "pageNo",
                    description: "pageNo",
                    required: true
                },
                {
                    in: "query",
                    type: "integer",
                    name: "pageSize",
                    description: "pageSize",
                    required: true
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
    {
        url: "/myCoins/{id}",
        get: {
            summary: "myCoins",
            description: "my Coins user by id ",
            parameters: [{
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
        url: "/deduct",
        post: {
            summary: "deduct coin",
            description: "deduct coin",
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
                    description: "model of deductCoin                                                                                  ",
                    required: true,
                    schema: {
                        $ref: "#/definitions/deductCoin"
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
        url: "/uploadIcon/{id}",
        put: {
            summary: "uploadIcon ",
            description: "uploadIcon ",
            parameters: [{
                in: "formData",
                name: "image",
                type: "file",
                description: "The file to upload.",
                required: true,
            },
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
                description: "coin id",
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
        url: "/setOffer/{id}/{setOffer}",
        put: {
            summary: "setOffer",
            description: "set Offer  by coin  id ",
            parameters: [{
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
                description: "coin id",
                required: true
            },
            {
                in: "path",
                type: "boolean",
                name: "setOffer",
                description: "set it true or false",
                default: false,
                required: true
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
        url: "/setPopular/{id}/{setPopular}",
        put: {
            summary: "setPopular",
            description: "set Popular  by coin  id ",
            parameters: [{
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
                description: "coin id",
                required: true
            },
            {
                in: "path",
                type: "boolean",
                name: "setPopular",
                description: "set it true or false",
                default: false,
                required: true
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
        url: "/dailyOffers",
        get: {
            summary: "daily Offers coins list",
            description: "daily Offers coins list",
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