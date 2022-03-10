const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true
        }, 
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
            enum: ['Spring', 'Summer', 'Fall', 'Winter']
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
        managers: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: 'User'
            }],
            required: true
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        status: {
            type: String,
            enum: ['planned', 'ongoing', 'finished']
        },
        sowingDate: Date,
    },
    {
        timestamps: true
    }
);

module.exports = model("Project", projectSchema);