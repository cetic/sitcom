class ContactImportsController < ApplicationController

  before_action :find_lab

  def new
    @errors = []
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

    @contact_import = ContactImport.new(@lab, @csv_data).parse

    if @contact_import.errors.any?
      @errors = @contact_import.errors
      render 'new'
    elsif commit
      @contact_import.commit
      redirect_to new_lab_contact_import_path(@lab), :notice => "Les #{@contact_import.rows.count} contacts ont été importés avec succès."
    end
  end

  def sample
    send_data File.read('misc/contact-import.csv'), {
      :filename    => 'contacts-import.csv',
      :disposition => 'attachment',
      :type        => 'text/csv'
    }
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
