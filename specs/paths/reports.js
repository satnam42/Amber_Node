module.exports = [{
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
                description: "model of register report",
                required: true,
                schema: {
                    $ref: "#/definitions/report"
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
    url: "/getReports",
    get: {
        summary: "get report list",
        description: "get  report list",
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