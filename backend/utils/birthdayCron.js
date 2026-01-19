const cron = require('node-cron');
const User = require('../models/User');
const sendEmail = require('./sendEmail');
const { getBirthdayEmail } = require('./emailTemplates');

const initBirthdayCron = () => {
  // Run every day at 09:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running Birthday Cron Job...');
    
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    try {
      const users = await User.find({
        $expr: {
          $and: [
            { $eq: [{ $month: '$birthday' }, month] },
            { $eq: [{ $dayOfMonth: '$birthday' }, day] },
          ],
        },
      });

      for (const user of users) {
        const html = getBirthdayEmail(user.name);

        await sendEmail({
          email: user.email,
          subject: 'Un cadeau d\'exception pour votre anniversaire - Nuraya',
          html,
        });
        
        console.log(`Birthday email sent to ${user.email}`);
      }
    } catch (err) {
      console.error('Error in Birthday Cron:', err);
    }
  });
};

module.exports = initBirthdayCron;
