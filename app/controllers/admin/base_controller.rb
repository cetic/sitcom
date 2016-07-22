class Admin::BaseController < ApplicationController

  # Filters

  before_action :authorize_admin

  # Methods

  private

  def authorize_admin
    unless current_user.admin?
      flash[:alert] = "Vous n'avez pas accès à cette page."
      redirect_to root_path
    end
  end

end
