const { Notification } = require('../Models/notification-model');

exports.sendNotify = async (receivers, description) => {

    receivers.map(async userx => {
        const user = {
               userData:userx,

        }
        const notification = new Notification({
              description: description,
              receiver: {
                userData:user.userData,
              } 
        })
       
        await notification.save();
    })
    return true
}

