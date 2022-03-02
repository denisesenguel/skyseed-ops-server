const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        }, 
        description: String,
        location: {
            type: String,
            required: true
        },
        season: {
            type: String,
            required: true,
            enum: ['Spring', 'Summer', 'Autumn', 'Winter']
        },
        year: {
            type: Number,
            required: true,
            // for production
            // min: new Date().getFullYear(),
            min: 2018,
            max: 2100
        },
        sizeInHa: {
            type: Number,
            min: 0
        },
        sowingDate: Date,
        managers: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: 'User'
            }]
            // add later
            // required: true
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer'
            // later: make this an array and add
            // required: true
        },
        status: {
            type: String,
            enum: ['planned', 'ongoing', 'finished']
        }
    },
    {
        timestamps: true
    }
);

module.exports = model("Project", projectSchema);