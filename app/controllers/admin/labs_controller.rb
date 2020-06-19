class Admin::LabsController < Admin::BaseController
  before_action :find_lab, :only => [ :edit, :update, :destroy ]

  def index
    if current_user.admin?
      @labs = Lab.order(:name)
    elsif current_user.lab_manager?
      @labs = current_user.labs.order(:name)
    else
      @labs = Lab.order(:name)
    end
  end

  def new
    @lab = Lab.new
    render 'form'
  end

  def create
    @lab = Lab.new(strong_params)

    if @lab.save
      unless current_user.admin?
        ApplicationMailer.lab_created(@lab, current_user).deliver_now
      end

      redirect_to admin_labs_path
    else
      set_flash_now_errors(@lab)
      render 'form'
    end
  end

  def edit
    render 'form'
  end

  def update
    if @lab.update(strong_params)
      if @lab.previous_changes.keys.any? { |key| key.start_with?('mailchimp_') } && @lab.mailchimp_configured?
        Mailchimp::CreateListFromContactsWorker.perform_async(@lab.id, 'SITCOM', @lab.contacts.map(&:id))
      end

      redirect_to admin_labs_path
    else
      set_flash_now_errors(@lab)
      render 'form'
    end
  end

  def destroy
    @lab.destroy
    redirect_to admin_labs_path
  end

  protected

  def find_lab
    if current_user.admin?
      @lab = Lab.find_by_slug(params[:id])
    elsif current_user.lab_manager?
      @lab = current_user.labs.find_by_slug(params[:id])
    else
      @lab = Lab.find_by_slug(params[:id])
    end
  end

  private

  def strong_params
    attributes = [
      :name, :address1, :address2, :city, :state, :zip, :country,
      :mailchimp_api_key,
      :mailchimp_company, :mailchimp_from_email,
      :mailchimp_address1, :mailchimp_address2, :mailchimp_city,
      :mailchimp_state, :mailchimp_zip, :mailchimp_country
    ]

    if current_user.admin?
      attributes << :account_type
    end

    params.require(:lab).permit(attributes)
  end
end
