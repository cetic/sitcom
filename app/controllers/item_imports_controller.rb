class ItemImportsController < ApplicationController

  before_action :find_lab
  before_action :find_item_type
  before_action :find_item_type_name
  after_action  :cleanup_tmp_files

  def new
    @errors = []
  end

  def create
    if params[:xlsx_file]
      xlsx_file_path = params[:xlsx_file].path
      @xlsx_data     = File.read(xlsx_file_path)
      @uuid          = SecureRandom.uuid.inspect

      File.open(Rails.root.join("tmp/#{@uuid}.xlsx"), 'w') do |f|
        f.write(@xlsx_data)
      end

      commit = false
    else
      @uuid = params[:uuid]

      if @uuid
        @xlsx_data = File.read(Rails.root.join("tmp/#{@uuid}.xlsx"))
        commit     = true
      else
        @errors = [
          "Vous n'avez pas sélectionné de fichier."
        ]
        render 'new'
      end
    end

    return unless @errors.blank?

    @item_import_class = "#{@item_type.capitalize}Import".constantize
    @item_import       = @item_import_class.new(@lab, @xlsx_data).parse

    if @item_import.errors.any?
      @errors = @item_import.errors
      render 'new'
    elsif commit
      @item_import.commit
      redirect_to new_lab_item_import_path(@lab, { :item_type => @item_type }), :notice => notice
    end
  end

  def sample
    send_data File.read("misc/#{@item_type}-import.xlsx"), {
      :filename    => "#{@item_type}s-import.xlsx",
      :disposition => 'attachment',
      :type        => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  end

  private

  def notice
    "Les #{@item_type_name}s ont été importés avec succès."
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  # to avoid injection (for File.read)
  def find_item_type
    if params[:item_type].in? ['contact', 'organization', 'project', 'event']
      @item_type = params[:item_type]
    end
  end

  def find_item_type_name
    if @item_type == 'contact'
      @item_type_name = 'contact'
      @of_items       = 'de contacts'
    elsif @item_type == 'organization'
      @item_type_name = 'organisation'
      @of_items       = "d'organisations"
    elsif @item_type == 'project'
      @item_type_name = 'projet'
      @of_items       = 'de projets'
    elsif @item_type == 'event'
      @item_type_name = 'évènement'
      @of_items       = "d'évènements"
    end
  end

  def cleanup_tmp_files
    Dir['tmp/*.xlsx'].each do |path|
      if File.ctime(path) < 2.days.ago
        FileUtils.rm(path)
      end
    end
  end

end
