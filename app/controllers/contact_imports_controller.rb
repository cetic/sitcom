class ContactImportsController < ApplicationController

  before_action :find_lab

  def new
  end

  def create
    if params[:csv_file]
      csv_file_path = params[:csv_file].path
      @csv_data     = File.read(csv_file_path)
      commit        = false
    else
      @csv_data = params[:csv_data]
      commit    = true
    end

    @contact_import = ContactImport.new(@lab, @csv_data)

    if commit
      @contact_import.commit
      flash[:success] = 'Les contacts ont été importés.'
      redirect_to new_lab_contact_import_path(@lab)
    end
  end

  private

  def strong_params
    params.require(:contact_import).permit(:role)
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
