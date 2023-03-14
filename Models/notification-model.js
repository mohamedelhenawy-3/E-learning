const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Notification = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

 receiver:{ 
     userData: {
            type: mongoose.Types.ObjectId,
             ref:"User"},
},
 read: {
        type: String,
        default: "false",
      },
},

  { timestamps: true }
);

exports.Notification = mongoose.model("Notifications", Notification);

//         name: {
//             type: String,
//             required: true,
//         }
//     },
//     read: {
//       type: String,
//       default: "false",
//     },
//   },
//   { timestamps: true }
// );

exports.Notification = mongoose.model("Notifications", Notification);
