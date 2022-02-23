module.exports = [{
    url: "/create",
    post: {
        summary: "create",
        description: "create",
        parameters: [
            {
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
        parameters: [
            {
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
    url: "/socialLogin",
    post: {
        summary: "socialLogin",
        description: "socialLogin",
        parameters: [
            {
                in: "body",
                name: "body",
                description: "Model of social Login",
                required: true,
                schema: {
                    $ref: "#/definitions/socialLogin"
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
    url: "/profileImageUpload/{id}",
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
        // {
        //     in: "header",
        //     name: "x-access-token",
        //     description: "token to access api",
        //     required: true,
        //     type: "string"
        // },
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
{
    url: "/follow",
    post: {
        summary: "follow ",
        description: "follow user",
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
                description: "follow user model",
                required: true,
                schema: {
                    $ref: "#/definitions/follow"
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
    url: "/unfollow",
    post: {
        summary: "unfollow",
        description: "unfollow ",
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
                description: "unfollow user model",
                required: true,
                schema: {
                    $ref: "#/definitions/unfollow"
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
    url: "/following/{id}",
    get: {
        summary: "following list ",
        description: "following list ",
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
{
    url: "/followers/{id}",
    get: {
        summary: "followers list ",
        description: "followers list ",
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
{
    url: "/random",
    get: {
        summary: "get user random user list",
        description: "get user random user list",
        parameters: [
            // {
            //     in: "header",
            //     name: "x-access-token",
            //     description: "token to access api",
            //     required: true,
            //     type: "string"
            // },
            {
                in: "query",
                type: "string",
                name: "gender",
                description: "gender",
                required: true
            },
            {
                in: "query",
                type: "string",
                name: "country",
                description: "country",
                required: true
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
    url: "/removeProfilePic/{id}",
    put: {
        summary: "remove Profile",
        description: "remove Profile Pic by userId ",
        parameters: [

            //     {
            //     in: "formData",
            //     name: "image",
            //     type: "file",
            //     description: "The file to upload.",
            //     required: true,
            // },
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
{
    url: "/uploadStory/{id}",
    put: {
        summary: "upload Story",
        description: "upload Story by userId ",
        parameters: [

            {
                in: "formData",
                name: "video",
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
{
    url: "/generateRtcToken",
    post: {
        summary: "Rtc Token",
        description: "RtcToken",
        parameters: [
            {
                in: "body",
                name: "body",
                description: "model of Rtc Token",
                required: true,
                schema: {
                    $ref: "#/definitions/rtcToken"
                }
            },
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
    url: "/getUsers",
    get: {
        summary: "get user list",
        description: "get  user list",
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

];