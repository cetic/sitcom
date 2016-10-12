class ApplicationMailer < ActionMailer::Base
  default from: MAIL_FROM
  layout 'mailer'
end
