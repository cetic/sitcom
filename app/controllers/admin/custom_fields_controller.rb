class Admin::CustomFieldsController < Admin::BaseController

  before_action :find_lab

  def index
    @custom_fields = @lab.custom_fields.order(:position)
  end

  def new
    @custom_field = CustomField.new
    render 'form'
  end

  def create
    @custom_field = @lab.custom_fields.new(strong_params)

    if @custom_field.save
      redirect_to admin_lab_custom_fields_path(@lab)
    else
      set_flash_now_errors(@custom_field)
      render 'form'
    end
  end

  def edit
    @custom_field = @lab.custom_fields.find(params[:id])
    render 'form'
  end

  def update
    @custom_field = @lab.custom_fields.find(params[:id])

    if @custom_field.update_attributes(strong_params)
      redirect_to admin_lab_custom_fields_path(@lab)
    else
      set_flash_now_errors(@custom_field)
      render 'form'
    end
  end

  def destroy
    @custom_field = @lab.custom_fields.find(params[:id])
    @custom_field.destroy
    redirect_to admin_lab_custom_fields_path(@lab)
  end

  protected

  def find_lab
    @lab = Lab.find_by_slug(params[:lab_id])
  end

  private

  def strong_params
    params[:custom_field][:options] ||= []

    params.require(:custom_field).permit(
      :name, :field_type, :options => []
    )
  end

end
