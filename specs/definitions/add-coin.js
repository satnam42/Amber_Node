module.exports = [
    {
        name: "addCoin",
        properties: {
            coins: {
                type: "string"
            },
            price: {
                type: "number"
            },
            category: {
                type: "string"
            },
            isPopular: {
                type: "boolean",
                default: false
            },
            isOnDailyOffer: {
                type: "boolean",
                default: false
            },
        }
    }
]