class Api::LabUserLinksController < Api::BaseController

  before_action :ensure_admin
  before_action :find_user
  before_action :find_lab_user_link, :only => [:show, :udate, :destroy]

  def index
    @lab_user_links = @user.lab_user_links
  end

  def show
  end

  def update
    if @lab_user_link.update_attributes(strong_params)
      render 'show'
    else
      render_errors(@user.errors.messages)
    end
  end

  def destroy
    @lab_user_link.destroy
    render :nothing => true
  end

  private

  def find_user
    @user = User.find(params[:user_id])
  end

  def find_lab_user_link
    @lab_user_link = @user.lab_user_links.find_by_lab_id!(params[:id])
  end

  def strong_params
    params.fetch(:permission, {}).permit(
      :can_read_contacts,      :can_write_contacts,
      :can_read_organizations, :can_write_organizations,
      :can_read_projects,      :can_write_projects,
      :can_read_events,        :can_write_events
    )
  end
end
