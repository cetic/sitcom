# frozen_string_literal: true

class ApplicationMailerPreview < ActionMailer::Preview

  def lab_created
    lab  = Lab.last
    user = lab.users.first

    ApplicationMailer.lab_created(lab, user)
  end

end
