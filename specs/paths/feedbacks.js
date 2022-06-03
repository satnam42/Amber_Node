module.exports = [{
    url: "/add",
    post: {
        summary: "add",
        description: "add",
        parameters: [
            {
                in: "body",
                name: "body",
                description: "model of feedback ",
                required: true,
                schema: {
                    $ref: "#/definitions/feedback"
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


// {
//     url: "/update/{id}",
//     put: {
//         summary: "update",
//         description: "update user profile using user id ",
//         parameters: [{
//             in: "header",
//             name: "x-access-token",
//             description: "token to access api",
//             required: true,
//             type: "string"
//         },
//         {
//             in: "path",
//             type: "string",
//             name: "id",
//             description: "user id",
//             required: true
//         },
//         {
//             in: "body",
//             name: "body",
//             description: "Model of user profile update",
//             required: true,
//             schema: {
//                 $ref: "#/definitions/userUpdate"
//             }
//         }
//         ],
//         responses: {
//             default: {
//                 description: "Unexpected error",
//                 schema: {
//                     $ref: "#/definitions/Error"
//                 }
//             }
//         }
//     }
// },

{
    url: "/list",
    get: {
        summary: "feedback list",
        description: "feedback list",
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
}

];