# Skyseed Ops
REST API built with MongoDB, Express and NodeJS 

## local setup

`npm install`

Add `.env` that should look something like this

```
PORT=5000
ORIGIN=http://localhost:3000
TOKEN_SECRET='1evenmoresecretsecret!'
MAIL_HOST=smtp.gmail.com
MAIL_USER=mymail@gmail.com
MAIL_PASSWORD=my-password
```
The `MAIL_` environment variables specify the credentials for the email account that all nodemailer emails are sent from

In oder to start, execute
`npm run dev`