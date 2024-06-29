export class MockEmailSendService {
  async sendEmail(email: string, letter: string) {
    //console.log('MockEmailSendService' + email + letter);
  }

  createLetterRegistration(code: string) {
    const letter = `<h1>Thank for your registration</h1>`;
    return letter;
  }

  createLetterRegistrationResending(newCode: string) {
    const letter = `<h1>Thank for your registration Email Resending</h1>`;
    return letter;
  }

  createLetterRecoveryPassword(newCode: string) {
    const letter = `<h1>Password recovery</h1>`;
    return letter;
  }
}
