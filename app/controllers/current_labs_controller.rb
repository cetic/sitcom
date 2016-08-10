class CurrentLabsController < ApplicationController

  def destroy
    cookies.delete(:current_lab_id)
    redirect_to root_path
  end

end
