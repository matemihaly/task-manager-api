import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "mate.mihaly@scriptide.tech",
    subject: "Hurray! Welcome to the Task Manager App!",
    text: `Welcome to the app, ${name}! The documentation is on its way...`,
  });
};

export const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "mate.mihaly@scriptide.tech",
    subject: "Bye!",
    text: `Goodbye, ${name}!`,
  });
};
