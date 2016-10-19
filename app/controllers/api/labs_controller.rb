class Api::LabsController < Api::BaseController
  def index
    if @user.admin?
      @labs = Lab.order(:name)
    else
      @labs = @user.labs.order(:name)
    end
  end
end
