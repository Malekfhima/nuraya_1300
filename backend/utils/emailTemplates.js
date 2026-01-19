const getEmailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Lora&display=swap');
        
        body {
            font-family: 'Lora', serif;
            background-color: #FBFAF8;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #FBFAF8;
            padding: 40px 0;
        }
        
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border: 1px solid #E6E1DC;
            box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        
        .header {
            padding: 40px 20px;
            text-align: center;
            background-color: #2C2C2C;
        }
        
        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            color: #ffffff;
            letter-spacing: 2px;
            text-decoration: none;
            text-transform: uppercase;
        }
        
        .logo span {
            color: #8B7355;
        }
        
        .content {
            padding: 40px 30px;
            color: #2C2C2C;
            line-height: 1.8;
            font-size: 16px;
        }
        
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #8E8E8E;
            background-color: #FBFAF8;
        }
        
        .btn {
            display: inline-block;
            background-color: #2C2C2C;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            text-transform: uppercase;
            font-family: 'Playfair Display', serif;
            letter-spacing: 1px;
            font-size: 14px;
            margin: 25px 0;
            border-radius: 2px;
        }
        
        h1, h2 {
            font-family: 'Playfair Display', serif;
            color: #2C2C2C;
        }
        
        hr {
            border: 0;
            border-top: 1px solid #E6E1DC;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <a href="http://localhost:5173" class="logo">Nuraya<span> Support</span></a>
                </td>
            </tr>
            <tr>
                <td class="content">
                    ${content}
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; ${new Date().getFullYear()} Nuraya. Tous droits réservés.<br>
                    Élégance & Excellence depuis toujours.<br>
                    <br>
                    Suivez-nous sur nos réseaux sociaux.
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`;

const getVerificationEmail = (name, code) => getEmailWrapper(`
    <h1>Bienvenue dans l'univers Nuraya,</h1>
    <p>Monsieur/Madame <strong>${name}</strong>,</p>
    <p>Nous sommes honorés de vous compter parmi nos nouveaux membres. Votre inscription est la première étape vers une expérience d'exception.</p>
    <p>Veuillez utiliser le code de vérification ci-dessous pour activer votre compte Privilège :</p>
    <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background-color: #FBFAF8; border: 1px solid #E6E1DC; padding: 20px 40px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #2C2C2C; font-family: 'Playfair Display', serif;">
            ${code}
        </div>
    </div>
    <p style="text-align: center; font-size: 14px; color: #8E8E8E;">Ce code est valable pendant 24 heures.</p>
    <p>À très bientôt,<br>L'équipe Nuraya</p>
`);

const getForgotPasswordEmail = (name, url) => getEmailWrapper(`
    <h1>Réinitialisation de mot de passe</h1>
    <p>Bonjour ${name},</p>
    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Nuraya.</p>
    <p>Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe (ce lien est valable 10 minutes) :</p>
    <div style="text-align: center;">
        <a href="${url}" class="btn">Réinitialiser le mot de passe</a>
    </div>
    <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
`);

const getBirthdayEmail = (name) => getEmailWrapper(`
    <div style="text-align: center;">
        <h1 style="font-size: 32px; margin-bottom: 20px;">Joyeux Anniversaire</h1>
        <p style="font-size: 18px; color: #8B7355;">${name}</p>
        <p>En ce jour spécial, Nuraya souhaite célébrer votre élégance.</p>
        <div style="padding: 20px; border: 1px dashed #8B7355; background-color: #FBFAF8; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; text-transform: uppercase;">Votre cadeau exclusif</p>
            <p style="font-size: 28px; font-weight: bold; margin: 10px 0; color: #2C2C2C;">-15% DE REMISE</p>
            <p style="margin: 0;">Code: <strong style="color: #8B7355;">HB2026</strong></p>
        </div>
        <p>Que cette année supplémentaire soit synonyme de succès et de distinction.</p>
        <a href="http://localhost:5173/shop" class="btn">Découvrir la collection</a>
    </div>
`);

const getContactFormEmail = (data) => getEmailWrapper(`
    <h1>Nouveau Message Client</h1>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6E1DC;"><strong>Nom:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6E1DC;">${data.name}</td>
        </tr>
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6E1DC;"><strong>Email:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6E1DC;">${data.email}</td>
        </tr>
        <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6E1DC;"><strong>Sujet:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E6E1DC;">${data.subject}</td>
        </tr>
    </table>
    <div style="margin-top: 30px;">
        <strong>Message :</strong>
        <p style="background-color: #FBFAF8; padding: 20px; border-left: 4px solid #8B7355;">${data.message}</p>
    </div>
`);

module.exports = {
    getVerificationEmail,
    getForgotPasswordEmail,
    getBirthdayEmail,
    getContactFormEmail
};
