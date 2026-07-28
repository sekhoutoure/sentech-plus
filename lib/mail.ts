const APP_NAME = 'SenTech Plus';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const confirmLink = `${APP_URL}/verify-email?token=${token}`;
  
  console.log(`[MAIL SERVICE] Verification email to: ${email}`);
  console.log(`[MAIL SERVICE] Link: ${confirmLink}`);

  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${APP_NAME} <noreply@sentechplus.com>`,
          to: email,
          subject: `Vérifiez votre adresse email - ${APP_NAME}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
              <h2 style="color: #4f46e5; text-align: center;">Bienvenue sur ${APP_NAME} !</h2>
              <p>Bonjour,</p>
              <p>Merci de vous être inscrit sur notre plateforme. Veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Vérifier mon adresse email
                </a>
              </div>
              <p style="font-size: 12px; color: #6b7280;">Ce lien de vérification expirera dans 24 heures.</p>
              <p style="font-size: 12px; color: #9ca3af;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
            </div>
          `,
        }),
      });
      return response.ok;
    } catch (err) {
      console.error('[MAIL SERVICE] Failed to send verification email via Resend:', err);
    }
  }

  return true;
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  console.log(`[MAIL SERVICE] Password reset email to: ${email}`);
  console.log(`[MAIL SERVICE] Link: ${resetLink}`);

  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${APP_NAME} <noreply@sentechplus.com>`,
          to: email,
          subject: `Réinitialisation de votre mot de passe - ${APP_NAME}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
              <h2 style="color: #4f46e5; text-align: center;">Réinitialisation de mot de passe</h2>
              <p>Bonjour,</p>
              <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Réinitialiser le mot de passe
                </a>
              </div>
              <p style="font-size: 12px; color: #6b7280;">Ce lien expirera dans 1 heure.</p>
              <p style="font-size: 12px; color: #9ca3af;">Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            </div>
          `,
        }),
      });
      return response.ok;
    } catch (err) {
      console.error('[MAIL SERVICE] Failed to send reset email via Resend:', err);
    }
  }

  return true;
}
