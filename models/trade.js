const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
    name: {type: String, required: [true, 'name is required']},
    author: {type: Schema.Types.ObjectId, ref:'User'},
    category: {type: String, required: [true, 'category is required']},
    description: {type: String, required: [true, 'description is required'], minLength: [10, 'the description should have at least 10 characters']},
    status: {type: String, required: [true, 'status is required']},
    offerFrom: {type: Schema.Types.ObjectId, ref:'User'},
    offerForItem: {type: Schema.Types.ObjectId, ref:'Trade'},
    image: {type: String, required: [true, 'image is required']}
},
{timestamps: true});

//const Trade = mongoose.model('Trade', tradeSchema);

module.exports = mongoose.model('Trade', tradeSchema);

// const trades = [
//     {
//         id: '1',
//         name: 'Asus 570x Motherboard',
//         category: 'parts',
//         description: 'Motherboard with 4 ram slots, sits AMD CPUs',
//         status: 'Available',
//         image: 'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6356/6356983_sd.jpg',
//         createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '2',
//         name: 'Corsair 4GB ram sticks x2',
//         category: 'parts',
//         description: 'Quantity 2 full sized 4GB ram sticks',
//         status: 'Available',
//         image: 'https://m.media-amazon.com/images/I/71Q7GUUfJ3L.jpg',
//         createdAt: DateTime.local(2021, 2, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '3',
//         name: 'EKWB RGB Fans x4',
//         category: 'parts',
//         description: 'Quantity 4 5 inch fans with RGB lighting, capable of 1000rpm',
//         status: 'Available',
//         image: 'https://m.media-amazon.com/images/I/81+c4LIfhwL.jpg',
//         createdAt: DateTime.local(2021, 3, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '4',
//         name: 'Razer Basilisk Mouse',
//         category: 'accessories',
//         description: 'Gaming mouse with 4 total customizable macro buttons and RGB lighting',
//         status: 'Available',
//         image: 'https://m.media-amazon.com/images/I/71eXWvF3bEL.jpg',
//         createdAt: DateTime.local(2021, 4, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '5',
//         name: 'Logitech K120 Keyboard',
//         category: 'accessories',
//         description: 'Full size keyboard with function keys and numpad.',
//         status: 'Available',
//         image: 'https://resource.logitech.com/content/dam/logitech/en/products/keyboards/k120/gallery/k120-gallery-01-new.png',
//         createdAt: DateTime.local(2021, 5, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '6',
//         name: 'Logitech Z313 Speakers',
//         category: 'accessories',
//         description: 'Computer speaker system with subwoofer',
//         status: 'Available',
//         image: 'https://resource.logitech.com/content/dam/logitech/en/products/speakers/computer-speakers/z313/gallery/z313-gallery-1.png',
//         createdAt: DateTime.local(2021, 5, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '7',
//         name: 'Adobe Cloud',
//         category: 'software',
//         description: 'Adobe Cloud suite of products',
//         status: 'Available',
//         image: 'https://it.ucla.edu/sites/default/files/styles/sf_landscape_16x9/public/media/images/CC-Home-Image-v2.jpeg?h=b69e0e0e&itok=IFAPhE4S',
//         createdAt: DateTime.local(2021, 8, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '8',
//         name: 'Microsoft Office',
//         category: 'software',
//         description: 'Microsoft office suite of products including Word, Powerpoint, Excel, and Access',
//         status: 'Available',
//         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgEmjLLNGqUyLgSoObudK7hmHHwkAvrBDoTCXpWfjfYMpywDb-sOT1Nj9MJ2L5e_Uduc8&usqp=CAU',
//         createdAt: DateTime.local(2021, 2, 15, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     },
//     {
//         id: '9',
//         name: 'Adobe Photoshop',
//         category: 'software',
//         description: 'Adobe Photoshop professional image editor software',
//         status: 'Available',
//         image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTirHxQzoWPUFgJlbSq2gVRsXZjZ_cxygZL7OKlpKk5DI_rWHQf4gGOFh_BKjKax2wb7OY&usqp=CAU',
//         createdAt: DateTime.local(2021, 10, 15, 18, 0).toLocaleString(DateTime.DATETIME_SHORT)
//     }
// ];

// exports.find = () => trades;

// exports.findById = id => trades.find(trade=>trade.id === id);

// exports.save = function(trade){
//     trade.id = uuidv4();
//     trade.createdAt = DateTime.local(2021, 2, 12, 18, 0).toLocaleString(DateTime.DATETIME_SHORT);
//     trades.push(trade);
// };

// exports.updateById = (id, newtrade) => {
//     let trade = trades.find(trade=>trade.id === id);
//     if (trade) {
//         trade.name = newtrade.name;
//         trade.description = newtrade.description;
//     }
//     else {
//         return false;
//     }
// };

// exports.deleteById = id => {
//     let index = trades.findIndex(trade => trade.id === id);
//     if (index !== -1) {
//         trades.splice(index, 1);
//         return true;
//     } else {
//         return false;
//     }
// }