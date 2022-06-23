module.exports = [
    {
        url: "/sendCallNotification",
        post: {
            summary: "send Call Notification",
            description: "send Call Notification ",
            parameters: [{
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "Model of sendCallNotification",
                required: true,
                schema: {
                    $ref: "#/definitions/sendCallNotification"
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
        url: "/random",
        post: {
            summary: "random Call ",
            description: "random Call  ",
            parameters: [{
                in: "header",
                name: "x-access-token",
                description: "token to access api",
                required: true,
                type: "string"
            },
            {
                in: "body",
                name: "body",
                description: "Model of randomCall",
                required: true,
                schema: {
                    $ref: "#/definitions/randomCall"
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
        url: "/byUserId/{id}",
        get: {
            summary: "notifications list ",
            description: "notifications list by user id ",
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
        url: "/seen/{id}",
        put: {
            summary: "seen notification ",
            description: "seen notifications by id",
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
                    description: "notification id",
                    required: true
                },],
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