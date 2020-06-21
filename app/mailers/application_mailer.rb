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

  def item_updated(follower_id, user_id, item, action)
    @follower = User.find(follower_id)
    @user     = User.find(user_id)
    @item     = item
    @action   = action
    @lab      = @item.lab

    if @action == :item_updated
      @action_text = "a mis à jour la fiche de"
    elsif @action == :item_removed
      @action_text = "a supprimé la fiche de"
    elsif @action == :note_updated
      @action_text = "a modifié les notes publiques de la fiche de"
    elsif @action == :document_updated
      @action_text = "a modifié les documents publics de la fiche de"
    elsif @action == :custom_field_updated
      @action_text = "a modifié les champs personnalisés de la fiche de"
    end

    @subject = "#{@user.name} #{@action_text} \"#{@item.name}\""

    mail({
      :from    => MAIL_FROM,
      :subject => @subject,
      :to      => @follower.email
    })
  end
end
