class NotesController < ApplicationController

  before_action :find_lab
  before_action :find_notable
  before_action :find_notable_type
  before_action :find_note,         only: [ :update, :destroy ]
  before_action :check_permissions, only: [ :update, :destroy ]

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?(@notable_type)
          if params[:privacy] == 'private'
            @notes = @notable.notes.where({
              :privacy => 'private',
              :user_id => current_user.id
            })
          else
            @notes = BaseSearch.reject_private_notes(@notable.notes)
          end

          render :json => @notes.map(&:as_indexed_json)
        else
          render_permission_error
        end
      end
    end
  end

  def create
    can_write = PermissionsService.new(current_user, @lab).can_write?(@notable_type)

    respond_to do |format|
      format.json do
        @note      = @notable.notes.new(strong_params)
        @note.user = current_user

        if @note.privacy.private? || can_write
          if @note.save
            LogEntry.log_create_note(current_user, @note)

            render_json_success
          else
            render_json_errors(@note)
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
        if @note.update_attributes(strong_params)
          LogEntry.log_update_note(current_user, @note)

          render_json_success
        else
          render_json_errors(@note)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        if @note.destroy
          LogEntry.log_destroy_note(current_user, @note)

          render_json_success
        else
          render_json_errors(@note)
        end
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  def find_notable
    [:contact, :organization, :event, :project].each do |notable_type|
      notable_id = params["#{notable_type}_id".to_sym]

      if notable_id
        @notable = @lab.send(notable_type.to_s.pluralize.to_sym).find(notable_id)
      end
    end
  end

  def find_notable_type
    @notable_type = @notable.class.name.pluralize.underscore
  end

  def find_note
    @note = @notable.notes.find(params[:id])
  end

  def check_permissions
    can_write = PermissionsService.new(current_user, @lab).can_write?(@notable_type)
    can_read  = PermissionsService.new(current_user, @lab).can_read?(@notable_type)
    is_mine   = @note.user_id == current_user.id

    # user can update/destroy its own private notes
    unless (@note.privacy.public? && can_write) || (@note.privacy.private? && is_mine)
      render_permission_error
    end
  end

  def strong_params
    if params[:action] == 'create'
      params.require(:note).permit(:text, :privacy)
    else
      params.require(:note).permit(:text)
    end
  end
end
