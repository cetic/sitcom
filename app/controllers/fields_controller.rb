class FieldsController < ApplicationController

  before_action :find_lab

  def options
    @fields = Field.order(:name)
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
