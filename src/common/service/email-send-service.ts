import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailSendService {
  async sendEmail(email: string, letter: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pavvel.potapov@gmail.com',
        pass: 'cfas asrj bell izdi',
      },
    });

    await transport.sendMail({
      from: 'PavelBackend',
      to: email,
      subject: 'Test ПОДТВЕРЖДЕНИЕ регистации',
      html: letter,
    });
  }

  createLetterRegistration(code: string) {
    /*    в письме ссылка отбалды написана а по сценарию 
 рабочего приложения она должна перенапрвить
     на фронт и в урле будет КОД и тогда фронт сформирует 
     запрос на подтверждение регистрации с этим кодом
      */
    const letter = `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href="https://somesite.com/confirm-email?code=${code}">complete registration</a>
 </p>`;
    return letter;
  }

  createLetterRegistrationResending(newCode: string) {
    const letter = `<h1>Thank for your registration Email Resending</h1>
 <p>To finish registration please follow the link below:
     <a href="https://somesite.com/confirm-email?code=${newCode}">complete registration</a>
 </p>`;
    return letter;
  }

  createLetterRecoveryPassword(newCode: string) {
    const letter = `<h1>Password recovery</h1>
 <p>To finish password recovery please follow the link below:
     <a href="https://somesite.com/password-recovery?recoveryCode=${newCode}">recovery password</a>
 </p>`;
    return letter;
  }
}
