class ApplicationMailer < ActionMailer::Base
  layout 'mailer'

  def lab_created(lab, user)
    @lab     = lab
    @user    = user
    @subject = "Nouveau compte"

    mail({
      :from    => MAIL_FROM,
      :subject => @subject,
      :to      => ENV['ADMIN_EMAIL']
    })
  end
end
