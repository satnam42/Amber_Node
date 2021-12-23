module.exports = [{
    url: "/create",
    post: {
        summary: "create",
        description: "create",
        parameters: [{
            in: "body",
            name: "body",
            description: "model of register user",
            required: true,
            schema: {
                $ref: "#/definitions/userCreate"
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
    url: "/login",
    post: {
        summary: "login",
        description: "login",
        parameters: [{
            in: "body",
            name: "body",
            description: "Model of user login",
            required: true,
            schema: {
                $ref: "#/definitions/login"
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
    url: "/resetPassword/{id}",
    put: {
        summary: "reset Password ",
        description: "reset Password",
        parameters: [{
            in: "header",
            name: "x-access-token",
            description: "token to access api",
            required: true,
            type: "string"
        },
        {
            in: "path",
            name: "id",
            description: "user id",
            required: true,
            type: "string"
        },

        {
            in: "body",
            name: "body",
            description: "Model of resetPassword ",
            required: true,
            schema: {
                $ref: "#/definitions/resetPassword"
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
    url: "/update/{id}",
    put: {
        summary: "update",
        description: "update user profile using user id ",
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
        {
            in: "body",
            name: "body",
            description: "Model of user profile update",
            required: true,
            schema: {
                $ref: "#/definitions/userUpdate"
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
    url: "/profile/{id}",
    get: {
        summary: "get user",
        description: "get user profile detail ",
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
{
    url: "/uploadProfileImage/{id}",
    put: {
        summary: "upload Profile Pic ",
        description: "upload Profile Pic ",
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