class Admin::FieldsController < Admin::BaseController
  before_action :find_field, :only => [ :edit, :update, :destroy ]

  def index
    @fields = Field.where(parent_id: nil).order(:name)
  end

  def new
    if params[:field_id]
      @field = Field.find(params[:field_id]).children.new
    else
      @field = Field.new
    end

    render 'form'
  end

  def create
    @field = Field.new(strong_params)

    if @field.save
      redirect_to admin_fields_path
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
      redirect_to admin_fields_path
    else
      set_flash_now_errors(@field)
      render 'form'
    end
  end

  def destroy
    @field.destroy
    redirect_to admin_fields_path
  end

  protected

  def find_field
    @field = Field.find(params[:id])
  end

  private

  def strong_params
    params.require(:field).permit(:name, :parent_id)
  end
end
