class PagesController < ApplicationController

  skip_before_action :authenticate_user!

  def home
    # don't show home page if signed in
    if current_user
      find_lab_from_cookies

      if @lab
        redirect_to lab_contacts_path(@lab)
      else
        @labs = current_user.labs

        render 'labs/index'
      end
    else
      render :layout => 'home'
    end
  end

end
