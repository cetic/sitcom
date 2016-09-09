class NotesController < ApplicationController

  before_action :find_lab
  before_action :find_notable
  before_action :find_note, only: [ :update, :destroy ]

  def index
    respond_to do |format|
      format.json do
        @notes = @notable.notes
        render :json => @notes.map(&:as_indexed_json)
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @note      = @notable.notes.new(strong_params)
        @note.user = current_user

        if @note.save
          render_json_success
        else
          render_json_errors(@note)
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        if @note.update_attributes(strong_params)
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

  def find_note
    @note = @notable.notes.find(params[:id])
  end

  def strong_params
    if params[:action] == 'create'
      params.require(:note).permit(:text, :privacy)
    else
      params.require(:note).permit(:text)
    end
  end
end
