module.exports = [

    {
        name: "userUpdate",
        properties: {

            name: {
                type: "string"
            },
            phoneNo: {
                type: "string"
            },
            email: {
                type: "string"
            },
            password: {
                type: "string"
            },
            address: {
                type: "string"
            },
            city: {
                type: "string"
            },
            interests: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            interestedIn: {
                type: "string"
            },
            gender: {
                type: "string"
            },
            education: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }

            },
            career: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }
            },
            height: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }
            },
            drinking: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }
            },
            smoking: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }
            },
            religion: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }
            },
            political: {
                properties: {
                    content: {
                        type: "string"
                    },
                    isVisible: {
                        type: "string"
                    },
                }
            },

        },
    }

];