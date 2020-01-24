class Admin::FieldsController < Admin::BaseController

  before_action :find_lab
  before_action :find_field, :only => [ :edit, :update, :destroy ]

  def index
    @fields = @lab.fields.where(parent_id: nil)
                         .order(:name)
  end

  def new
    if params[:field_id]
      @field = @lab.fields.find(params[:field_id]).children.new
    else
      @field = @lab.fields.new
    end

    render 'form'
  end

  def create
    @field     = @lab.fields.new(strong_params)
    @field.lab = @lab

    if @field.save
      redirect_to admin_lab_fields_path(@lab)
    else
      set_flash_now_errors(@field)
      render 'form'
    end
  end

  def edit
    render 'form'
  end

  def update
    if @field.update(strong_params)
      redirect_to admin_lab_fields_path(@lab)
    else
      set_flash_now_errors(@field)
      render 'form'
    end
  end

  def destroy
    @field.destroy
    redirect_to admin_lab_fields_path(@lab)
  end

  protected

  def find_field
    @field = @lab.fields.find(params[:id])
  end

  private

  def strong_params
    params.require(:field).permit(:name, :parent_id)
  end
end
