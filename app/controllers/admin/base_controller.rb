class Admin::BaseController < ApplicationController

  # Filters

  before_action :authorize_admin_or_lab_manager

  # Methods

  private

  def authorize_admin_or_lab_manager
    unless current_user.admin? || current_user.lab_manager?
      flash[:alert] = "Vous n'avez pas accès à cette page."
      redirect_to root_path
    end
  end

  def find_user
    if current_user.lab_manager?
      user_ids = current_user.labs.map(&:user_ids).flatten.uniq

      @user = User.where(id: user_ids).find(params[:user_id])
    else
      @user = User.find(params[:user_id])
    end
  end

  def find_lab
    if current_user.lab_manager?
      @lab = current_user.labs.find_by_slug(params[:lab_id])
    else
      @lab = Lab.find_by_slug(params[:lab_id])
    end
  end

end
