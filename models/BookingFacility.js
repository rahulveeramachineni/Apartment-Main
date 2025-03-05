const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookingFacilitySchema = new Schema({
    bookingId: {
        type: String,
        required: true
    },
    facilitys: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true  
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

BookingFacilitySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

BookingFacilitySchema.set('toJSON', {
    virtuals: true
});

module.exports = BookingFacility = mongoose.model("BookingFacility", BookingFacilitySchema);
