class RegistrationsController < ApplicationController

  skip_before_action :authenticate_user!
  before_action :require_no_current_user!

  def new
    @registration = Registration.new
  end

  def create
    @registration = Registration.new(strong_params)

    if @registration.save
      flash[:success] = "Votre compte a été créé."
      redirect_to new_user_session_path
    else
      set_flash_now_errors(@registration)
      render 'new'
    end
  end

  private

  def require_no_current_user!
    return unless current_user

    redirect_to root_path
  end

  def strong_params
    params.require(:registration).permit(
      :name, :email, :password, :password_confirmation,
      :lab_name, :lab_vat_number,
      :lab_address1, :lab_address2, :lab_city, :lab_state, :lab_zip, :lab_country
    )
  end
end
