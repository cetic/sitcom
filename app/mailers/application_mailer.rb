class ApplicationMailer < ActionMailer::Base
  layout 'mailer'

  def info(subject, body = "")
    @body = body

    mail({
      :from    => MAIL_FROM,
      :subject => "#{subject}",
      :to => [
        'aurelien.malisart@gmail.com',
        'michael.hoste@gmail.com'
      ]
    })
  end
end
