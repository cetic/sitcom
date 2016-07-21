class Admin::LabsController < Admin::BaseController
  before_action :find_lab,        :only => [ :edit, :update, :destroy ]

  def index
    @labs = Lab.order(:name)
  end

  def new
    @lab = Lab.new
    render 'form'
  end

  def create
    @lab = Lab.new(strong_params)

    if @lab.save
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
    @lab = Lab.find(params[:id])
  end

  private

  def strong_params
    params.require(:lab).permit(:name)
  end
end
