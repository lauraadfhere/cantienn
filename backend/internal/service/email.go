package service

import (
	"bytes"
	"crypto/tls"
	"fmt"
	"html/template"
	"net/smtp"

	"wippel-backend/internal/config"
)

type EmailService struct {
	config *config.Config
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{
		config: cfg,
	}
}

type EmailData struct {
	SiteName  string
	SiteURL   string
	Name      string
	Email     string
	Message   string
	Service   string
	Budget    string
	Company   string
	Subject   string
	OrderID   string
	ContactID string
}

func (e *EmailService) SendOrderNotification(data EmailData) error {
	if !e.config.SMTP.Enabled() {
		return fmt.Errorf("SMTP not configured")
	}

	subject := fmt.Sprintf("New Order from %s - %s", data.Name, e.config.SiteName)
	body := e.renderOrderTemplate(data)

	adminEmail := e.config.SMTP.AdminTo
	if adminEmail == "" {
		return fmt.Errorf("SMTP_ADMIN_TO not configured")
	}

	return e.sendEmail(adminEmail, subject, body)
}

func (e *EmailService) SendContactNotification(data EmailData) error {
	if !e.config.SMTP.Enabled() {
		return fmt.Errorf("SMTP not configured")
	}

	subject := fmt.Sprintf("New Contact Message from %s - %s", data.Name, e.config.SiteName)
	body := e.renderContactTemplate(data)

	if e.config.SMTP.AdminTo == "" {
		return fmt.Errorf("SMTP_ADMIN_TO not configured")
	}
	return e.sendEmail(e.config.SMTP.AdminTo, subject, body)
}

func (e *EmailService) SendThankYouEmail(data EmailData) error {
	if !e.config.SMTP.Enabled() {
		return fmt.Errorf("SMTP not configured")
	}

	subject := fmt.Sprintf("Thank you for contacting %s", e.config.SiteName)
	body := e.renderThankYouTemplate(data)

	return e.sendEmail(data.Email, subject, body)
}

func (e *EmailService) sendEmail(to, subject, body string) error {
	from := e.config.SMTP.From
	password := e.config.SMTP.Password
	smtpHost := e.config.SMTP.Host
	smtpPort := e.config.SMTP.Port

	headers := make(map[string]string)
	headers["From"] = from
	headers["To"] = to
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=\"UTF-8\""

	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + body

	auth := smtp.PlainAuth("", e.config.SMTP.Username, password, smtpHost)

	tlsConfig := &tls.Config{
		InsecureSkipVerify: false,
		ServerName:         smtpHost,
	}

	conn, err := tls.Dial("tcp", smtpHost+":"+smtpPort, tlsConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to SMTP server: %v", err)
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, smtpHost)
	if err != nil {
		return fmt.Errorf("failed to create SMTP client: %v", err)
	}
	defer client.Quit()

	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP authentication failed: %v", err)
	}

	if err = client.Mail(from); err != nil {
		return fmt.Errorf("failed to set sender: %v", err)
	}

	if err = client.Rcpt(to); err != nil {
		return fmt.Errorf("failed to set recipient: %v", err)
	}

	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("failed to get data writer: %v", err)
	}

	_, err = w.Write([]byte(message))
	if err != nil {
		return fmt.Errorf("failed to write message: %v", err)
	}

	err = w.Close()
	if err != nil {
		return fmt.Errorf("failed to close writer: %v", err)
	}

	return nil
}

func (e *EmailService) renderOrderTemplate(data EmailData) string {
	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Questrial', Arial, sans-serif; background-color: #f8f7f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: #8F001A; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; color: #ffffff; font-weight: 900; }
        .content { padding: 40px 30px; }
        .content h2 { color: #8F001A; font-size: 22px; margin-top: 0; font-weight: 700; }
        .info-row { margin: 15px 0; padding: 12px; background: #f8f7f4; border-radius: 4px; border-left: 4px solid #8F001A; }
        .info-label { font-weight: 700; color: #1a1a1a; font-size: 14px; }
        .info-value { color: #4a4a4a; margin-top: 5px; font-size: 15px; }
        .footer { background: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; font-size: 12px; }
        .footer a { color: #ffffff; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 New Order Received!</h1>
        </div>
        <div class="content">
            <h2>Order Details</h2>
            <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">{{.Name}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{.Email}}</div>
            </div>
            {{if .Company}}
            <div class="info-row">
                <div class="info-label">Company:</div>
                <div class="info-value">{{.Company}}</div>
            </div>
            {{end}}
            <div class="info-row">
                <div class="info-label">Service:</div>
                <div class="info-value">{{.Service}}</div>
            </div>
            {{if .Budget}}
            <div class="info-row">
                <div class="info-label">Budget:</div>
                <div class="info-value">{{.Budget}}</div>
            </div>
            {{end}}
            {{if .Message}}
            <div class="info-row">
                <div class="info-label">Message:</div>
                <div class="info-value">{{.Message}}</div>
            </div>
            {{end}}
        </div>
        <div class="footer">
            <p>This email was sent from <a href="{{.SiteURL}}">{{.SiteName}}</a></p>
            <p>&copy; 2024 {{.SiteName}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
	data.SiteName = e.config.SiteName
	data.SiteURL = e.config.SiteURL

	t := template.Must(template.New("order").Parse(tmpl))
	var buf bytes.Buffer
	t.Execute(&buf, data)
	return buf.String()
}

func (e *EmailService) renderContactTemplate(data EmailData) string {
	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Questrial', Arial, sans-serif; background-color: #f8f7f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #FFD700 0%, #FFEA00 100%); padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; color: #000; font-weight: 900; }
        .content { padding: 40px 30px; }
        .content h2 { color: #000; font-size: 22px; margin-top: 0; font-weight: 700; }
        .info-row { margin: 15px 0; padding: 12px; background: #f8f7f4; border-radius: 4px; }
        .info-label { font-weight: 700; color: #1a1a1a; font-size: 14px; }
        .info-value { color: #4a4a4a; margin-top: 5px; font-size: 15px; }
        .footer { background: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
        .footer a { color: #FFD700; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 New Contact Message!</h1>
        </div>
        <div class="content">
            <h2>Contact Details</h2>
            <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">{{.Name}}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">{{.Email}}</div>
            </div>
            {{if .Subject}}
            <div class="info-row">
                <div class="info-label">Subject:</div>
                <div class="info-value">{{.Subject}}</div>
            </div>
            {{end}}
            <div class="info-row">
                <div class="info-label">Message:</div>
                <div class="info-value">{{.Message}}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from <a href="{{.SiteURL}}">{{.SiteName}}</a></p>
            <p>&copy; 2024 {{.SiteName}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
	data.SiteName = e.config.SiteName
	data.SiteURL = e.config.SiteURL

	t := template.Must(template.New("contact").Parse(tmpl))
	var buf bytes.Buffer
	t.Execute(&buf, data)
	return buf.String()
}

func (e *EmailService) renderThankYouTemplate(data EmailData) string {
	tmpl := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Questrial', Arial, sans-serif; background-color: #f8f7f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: #8F001A; padding: 50px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; color: #ffffff; font-weight: 900; }
        .header p { margin: 10px 0 0 0; font-size: 16px; color: rgba(255,255,255,0.85); }
        .content { padding: 40px 30px; }
        .content h2 { color: #8F001A; font-size: 24px; margin-top: 0; font-weight: 700; }
        .content p { color: #4a4a4a; line-height: 1.6; font-size: 16px; }
        .highlight-box { background: #f8f7f4; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; border: 1px solid #e5e7eb; }
        .highlight-box p { color: #8F001A; font-weight: 700; font-size: 18px; margin: 0; }
        .cta-button { display: inline-block; background: #8F001A; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 700; margin: 20px 0; }
        .footer { background: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; font-size: 12px; }
        .footer a { color: #ffffff; text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You, {{.Name}}! 🎉</h1>
            <p>We've received your message</p>
        </div>
        <div class="content">
            <h2>We appreciate you reaching out!</h2>
            <p>Thank you for contacting <strong>{{.SiteName}}</strong>. We've received your message and our team will get back to you as soon as possible.</p>

            <div class="highlight-box">
                <p>⏱️ Expected Response Time: Within 24 hours</p>
            </div>

            <p>In the meantime, feel free to explore our services and learn more about what we can do for you.</p>

            <div style="text-align: center;">
                <a href="{{.SiteURL}}/services" class="cta-button">Explore Our Services</a>
            </div>

            <p style="margin-top: 30px;">If you have any urgent questions, don't hesitate to reach out to us directly.</p>
        </div>
        <div class="footer">
            <p><strong>{{.SiteName}}</strong></p>
            <p>Building production-ready web platforms</p>
            <p style="margin-top: 15px;">
                <a href="{{.SiteURL}}">Visit Website</a> |
                <a href="{{.SiteURL}}/services">Services</a> |
                <a href="{{.SiteURL}}/contact">Contact</a>
            </p>
            <p style="margin-top: 20px; font-size: 12px; color: #a8a5a0;">
                &copy; 2024 {{.SiteName}}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
`
	data.SiteName = e.config.SiteName
	data.SiteURL = e.config.SiteURL

	t := template.Must(template.New("thankyou").Parse(tmpl))
	var buf bytes.Buffer
	t.Execute(&buf, data)
	return buf.String()
}
