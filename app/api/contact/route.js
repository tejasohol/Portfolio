// import axios from 'axios';
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   const payload = await request.json();
//   const token = process.env.TELEGRAM_BOT_TOKEN;
//   const chat_id = process.env.TELEGRAM_CHAT_ID;

//   if (!token || !chat_id) {
//     return NextResponse.json({
//       success: false,
//     }, { status: 200 });
//   };

//   try {
//     const url = `https://api.telegram.org/bot${token}/sendMessage`;
//     const message = `New message from ${payload.name}\n\nEmail: ${payload.email}\n\nMessage:\n ${payload.message}\n\n`;

//     const res = await axios.post(url, {
//       text: message,
//       chat_id: process.env.TELEGRAM_CHAT_ID
//     });

//     if (res.data.ok) {
//       return NextResponse.json({
//         success: true,
//         message: "Message sent successfully!",
//       }, { status: 200 });
//     };
//   } catch (error) {
//     console.log(error.response.data)
//     return NextResponse.json({
//       message: "Message sending failed!",
//       success: false,
//     }, { status: 500 });
//   }
// };




import { NextResponse } from "next/server";
import emailjs from 'emailjs-com';

export async function POST(request) {
  const payload = await request.json();

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const userId = process.env.EMAILJS_USER_ID;

  if (!serviceId || !templateId || !userId) {
    return NextResponse.json({
      success: false,
      message: "Missing EmailJS credentials.",
    }, { status: 500 });
  }

  try {
    const templateParams = {
      name: payload.name,
      email: payload.email,
      message: payload.message,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, userId);

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: "Message sent successfully!",
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: "Message sending failed!",
      }, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Message sending failed!",
      success: false,
    }, { status: 500 });
  }
};
