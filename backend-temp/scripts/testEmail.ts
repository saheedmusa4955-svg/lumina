import { sendEmail, templates } from '../src/utils/mailer';
import prisma from '../src/db';

async function main() {
  const settings = await prisma.setting.findMany();
  console.log('--- CURRENT SETTINGS IN DB ---');
  settings.forEach(s => console.log(`${s.key}: ${s.value}`));
  console.log('------------------------------');

  const email = 'saheedsuleiman4955@gmail.com';
  console.log('Sending Welcome email...');
  await sendEmail(email, 'Welcome to Lumina Bank', templates.welcome('Saheed'));
  
  console.log('All test emails sent. Check logs for errors.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
