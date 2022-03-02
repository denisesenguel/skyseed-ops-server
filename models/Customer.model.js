const { Schema, model } = require('mongoose');

const customerSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Customer", customerSchema);