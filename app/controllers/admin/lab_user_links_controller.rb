class Admin::LabUserLinksController < Admin::BaseController

  before_action :find_user
  before_action :redirect_if_admin
  before_action :find_lab_user_links

  def index
  end

  def update_many
    data = params[:lab_user_links] || {}

    @lab_user_links.each do |lab_user_link|
      attributes = data[lab_user_link.id.to_s]

      PermissionsService::MODULES.keys.each do |item_key|
        can_write =               attributes.present? && attributes["can_write_#{item_key}"] == '1'
        can_read  = can_write || (attributes.present? && attributes["can_read_#{item_key}"]  == '1')

        lab_user_link.send("can_write_#{item_key}=", can_write)
        lab_user_link.send("can_read_#{item_key}=",  can_read)

        lab_user_link.save!
      end
    end

    flash[:success] = 'Les droits ont été enregistrés.'

    redirect_to admin_user_lab_user_links_path(@user)
  end

  protected

  def redirect_if_admin
    if @user.admin? || @user.lab_manager?
      redirect_to admin_users_path
    end
  end

  def find_lab_user_links
    if current_user.lab_manager?
      @lab_user_links = @user.lab_user_links.where(lab_id: current_user.lab_ids)
    else
      @lab_user_links = @user.lab_user_links
    end
  end

  private

  def strong_params
    params.require(:lab_user_link).permit(
      :can_read_contacts,      :can_write_contacts,
      :can_read_organizations, :can_write_organizations,
      :can_read_projects,      :can_write_projects,
      :can_read_events,        :can_write_events
    )
  end

end
