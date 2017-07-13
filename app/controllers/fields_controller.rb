class FieldsController < ApplicationController

  before_action :find_lab

  def options
    @fields = @lab.fields.includes(:children).where(parent_id: nil).order(:name).collect do |field|
      [field, field.children.sort_by { |field| field.name.downcase }]
    end.flatten
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

end
