class DocumentsController < ApplicationController

  before_action :find_lab
  before_action :find_uploadable
  before_action :find_uploadable_type
  before_action :find_document,     :only => [ :show, :update, :destroy ]
  before_action :clean_params,      :only => [ :create ] # for dropzone
  before_action :check_permissions, :only => [ :show, :update, :destroy ]

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?(@uploadable_type)
          if params[:privacy] == 'private'
            @documents = @uploadable.documents.where({
              :privacy => 'private',
              :user_id => current_user.id
            })
          else
            @documents = BaseSearch.reject_private_documents(@uploadable.documents)
          end

          render :json => @documents.map(&:as_indexed_json)
        else
          render_permission_error
        end
      end
    end
  end

  def show
    can_write = PermissionsService.new(current_user, @lab).can_read?(@uploadable_type)

    if (@document.privacy.private? && @document.user_id == current_user.id) || @document.privacy.public?
      send_file @document.file.path
    else
      render_permission_error
    end
  end

  def create
    can_write = PermissionsService.new(current_user, @lab).can_write?(@uploadable_type)

    respond_to do |format|
      format.json do
        @document      = @uploadable.documents.new(strong_params)
        @document.user = current_user

        if @document.privacy.private? || can_write
          if @document.save
            LogEntry.log_create_document(current_user, @document)

            render_json_success
          else
            render_json_errors(@document)
          end
        else
          render_permission_error
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        if @document.update(strong_params)
          # we don't save changes of description, only uploading and removing of files
          #LogEntry.log_update_document(current_user, @document)

          render_json_success
        else
          render_json_errors(@document)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        if @document.destroy
          LogEntry.log_destroy_document(current_user, @document)

          render_json_success
        else
          render_json_errors(@document)
        end
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  def find_uploadable
    [:contact, :organization, :event, :project].each do |uploadable_type|
      uploadable_id = params["#{uploadable_type}_id".to_sym]

      if uploadable_id
        @uploadable = @lab.send(uploadable_type.to_s.pluralize.to_sym).find(uploadable_id)
      end
    end
  end

  def find_uploadable_type
    @uploadable_type = @uploadable.class.name.pluralize.underscore
  end

  def find_document
    @document = @uploadable.documents.find(params[:id])
  end

  def check_permissions
    can_write = PermissionsService.new(current_user, @lab).can_write?(@uploadable_type)
    can_read  = PermissionsService.new(current_user, @lab).can_read?(@uploadable_type)
    is_mine   = @document.user_id == current_user.id

    # user can update/destroy its own private documents
    unless (@document.privacy.public? && can_write) || (@document.privacy.private? && is_mine)
      render_permission_error
    end
  end

  # Encapsulate new picture in "contact" (don't know how to make it in JS)
  def clean_params
    params[:document] ||= {}
    params[:document][:file]    = params[:file]
    params[:document][:privacy] = params[:privacy]
    params.delete(:file)
    params.delete(:privacy)
  end

  def strong_params
    if params[:action] == 'create'
      params.require(:document).permit(:file, :description, :privacy)
    else
      params.require(:document).permit(:description)
    end
  end
end
