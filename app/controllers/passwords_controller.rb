class PasswordsController < ApplicationController
  def show
    redirect_to edit_profile_password_path
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user

    if params[:user][:current_password].blank?
      flash[:alert] = "Veuillez entrer votre mot de passe actuel."
      redirect_to edit_profile_password_path
    else
      if @user.update_with_password(strong_params)
        sign_in(@user, :bypass => true)
        flash[:notice] = "Votre mot de passe a été changé."
        redirect_to root_path
      else
        set_flash_now_errors(@user)
        render 'edit'
      end
    end
  end

  private

  def strong_params
    params.require(:user).permit(:current_password, :password, :password_confirmation)
  end
end
