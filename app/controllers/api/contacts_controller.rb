class Api::ContactsController < Api::BaseController

  before_action :find_lab
  before_action :find_contact, :only => [:show, :update, :destroy]

  def index
    if PermissionsService.new(@current_user, @lab).can_read?('contacts')
      @contacts = @lab.contacts.page(params[:page]).per(PER_PAGE)
    else
      render_permission_error
    end
  end

  def show
    unless PermissionsService.new(@current_user, @lab).can_read?('contacts')
      render_permission_error
    end
  end

  def create
    if PermissionsService.new(@current_user, @lab).can_write?('contacts')
      @contact = @lab.contacts.new(strong_params)

      if @contact.save
        LogEntry.log_create(@current_user, @contact)

        render 'show'
      else
        render_errors(@contact.errors.messages)
      end
    else
      render_permission_error
    end
  end

  def update
    if PermissionsService.new(@current_user, @lab).can_write?('contacts')
      previous_association_ids = @contact.association_ids

      if @contact.update_attributes(strong_params)
        LogEntry.log_update(@current_user, @contact, previous_association_ids)
        cleanup_orphan_tags

        render 'show'
      else
        render_errors(@contact.errors.messages)
      end
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(@current_user, @lab).can_write?('contacts')
      previous_association_ids = @contact.association_ids

      if @contact.destroy
        LogEntry.log_destroy(@current_user, @contact, previous_association_ids)
        cleanup_orphan_tags

        render_success
      else
        render_errors(@contact.errors.messages)
      end
    else
      render_permission_error
    end
  end

  private

  def find_contact
    @contact = @lab.contacts.find(params[:id])
  end

  def strong_params
    params.fetch(:contact, {}).permit(
      :first_name, :last_name, :active, :email, :phone,
      :address_street, :address_zip_code, :address_city, :address_country,
      :twitter_url, :linkedin_url, :facebook_url,
      :picture,
      :organization_ids => [],
      :project_ids      => [],
      :event_ids        => []
    )
  end

end
