class Api::LabsController < Api::BaseController
  def index
    if @current_user.admin?
      @labs = Lab.order(:name)
    else
      @labs = @current_user.labs.order(:name)
    end
  end

  def show
    if @current_user.admin?
      @lab = Lab.find(params[:id])
    else
      @lab = @current_user.labs.find(params[:id])
    end
  end
end
