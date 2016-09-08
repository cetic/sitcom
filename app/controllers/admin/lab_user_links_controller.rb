class Admin::LabUserLinksController < Admin::BaseController
  before_action :find_user
  before_action :redirect_if_admin

  def index
    @lab_user_links = @user.lab_user_links
  end

  def update_many
    params[:lab_user_links].each do |link_id, attributes|
      link = @user.lab_user_links.find(link_id)

      PermissionsService::MODULES.keys.each do |item_key|
        link.send("can_read_#{item_key}=",  attributes["can_read_#{item_key}"])
        link.send("can_write_#{item_key}=", attributes["can_write_#{item_key}"])

        link.save!
      end
    end

    flash[:success] = 'Les droits ont été enregistrés.'

    redirect_to admin_user_lab_user_links_path(@user)
  end

  protected

  def find_user
    @user = User.find(params[:user_id])
  end

  def redirect_if_admin
    if @user.admin?
      redirect_to admin_users_path
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
