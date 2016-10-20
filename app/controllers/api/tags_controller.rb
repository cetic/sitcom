class Api::TagsController < Api::BaseController

  before_action :find_lab

  def index
    if PermissionsService.new(@current_user, @lab).can_read?('contacts')
      if params[:contact_id]
        @contact = @lab.contacts.find(params[:contact_id])
        @tags    = @contact.tags
      else
        @tags = @lab.tags
      end
    else
      render_permission_error
    end
  end

  def create
    if PermissionsService.new(@current_user, @lab).can_write?('contacts')
      @contact = @lab.contacts.find(params[:contact_id])

      params[:names].each do |name|
        ContactTagService.new(@current_user, @contact).add_tag(name)
      end

      @contact.reload
      @tags = @contact.tags

      render 'index'
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(@current_user, @lab).can_write?('contacts')
      @contact = @lab.contacts.find(params[:contact_id])

      params[:names].each do |name|
        tag = @lab.tags.find_by_name(name)

        if tag
          ContactTagService.new(@current_user, @contact).remove_tag(tag.id)
        end
      end

      @contact.reload
      @tags = @contact.tags

      render 'index'
    else
      render_permission_error
    end
  end

end
