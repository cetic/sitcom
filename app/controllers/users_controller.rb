class UsersController < ApplicationController

  before_action :find_lab

  def options
    respond_to do |format|
      format.json do
        @users = @lab.users.order(:name)
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
  end
end
