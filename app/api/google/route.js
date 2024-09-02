// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const reqBody = await request.json();
//   const secret_key = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

//   try {
//     const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${reqBody.token}`;

//     const res = await axios.post(url);
//     if (res.data.success) {
//       return NextResponse.json({
//         message: "Captcha verification success!!",
//         success: true,
//       })
//     };

//     return NextResponse.json({
//       error: "Captcha verification failed!",
//       success: false,
//     }, { status: 500 });
//   } catch (error) {
//     return NextResponse.json({
//       error: "Captcha verification failed!",
//       success: false,
//     }, { status: 500 });
//   }
// };





// // import React, { useRef } from 'react';
// // import emailjs from '@emailjs/browser';

// // export const ContactUs = () => {
// //   const form = useRef();

// //   const sendEmail = (e) => {
// //     e.preventDefault();

// //     emailjs
// //       .sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, {
// //         publicKey: 'YOUR_PUBLIC_KEY',
// //       })
// //       .then(
// //         () => {
// //           console.log('SUCCESS!');
// //         },
// //         (error) => {
// //           console.log('FAILED...', error.text);
// //         },
// //       );
// //   };

// //   return (
// //     <form ref={form} onSubmit={sendEmail}>
// //       <label>Name</label>
// //       <input type="text" name="user_name" />
// //       <label>Email</label>
// //       <input type="email" name="user_email" />
// //       <label>Message</label>
// //       <textarea name="message" />
// //       <input type="submit" value="Send" />
// //     </form>
// //   );







import axios from "axios";
import { NextResponse } from "next/server";
import emailjs from 'emailjs-com';

export async function POST(request) {
  const reqBody = await request.json();
  const secret_key = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

  try {
    // Verify reCAPTCHA token
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${reqBody.token}`;
    const recaptchaRes = await axios.post(recaptchaUrl);

    if (recaptchaRes.data.success) {
      // reCAPTCHA verification success, proceed with sending the email
      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const userId = process.env.EMAILJS_USER_ID;

      if (!serviceId || !templateId || !userId) {
        return NextResponse.json({
          success: false,
          message: "Missing EmailJS credentials.",
        }, { status: 500 });
      }

      const templateParams = {
        name: reqBody.name,
        email: reqBody.email,
        message: reqBody.message,
      };

      const emailRes = await emailjs.send(serviceId, templateId, templateParams, userId);

      if (emailRes.status === 200) {
        return NextResponse.json({
          success: true,
          message: "Captcha verification and email sending succeeded!",
        }, { status: 200 });
      } else {
        return NextResponse.json({
          success: false,
          message: "Captcha verification succeeded but email sending failed!",
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      error: "Captcha verification failed!",
      success: false,
    }, { status: 500 });
  } catch (error) {
    return NextResponse.json({
      error: "Captcha verification or email sending failed!",
      success: false,
    }, { status: 500 });
  }
};
