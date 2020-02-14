class Admin::CustomFieldsController < Admin::BaseController

  before_action :find_lab

  def index
    @contact_custom_fields      = @lab.custom_fields.where(item_type: 'Contact'     ).order(:position)
    @organization_custom_fields = @lab.custom_fields.where(item_type: 'Organization').order(:position)
    @project_custom_fields      = @lab.custom_fields.where(item_type: 'Project'     ).order(:position)
    @event_custom_fields        = @lab.custom_fields.where(item_type: 'Event'       ).order(:position)
  end

  def new
    @custom_field = CustomField.new
    render 'form'
  end

  def create
    @custom_field = @lab.custom_fields.new(strong_params)

    if @custom_field.save
      ReindexAllItemsWorker.perform_async(@lab.id, @custom_field.item_type)
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

    if @custom_field.update(strong_params)
      @custom_field.ensure_concistency
      ReindexAllItemsWorker.perform_async(@lab.id, @custom_field.item_type)
      redirect_to admin_lab_custom_fields_path(@lab)
    else
      set_flash_now_errors(@custom_field)
      render 'form'
    end
  end

  def destroy
    @custom_field = @lab.custom_fields.find(params[:id])
    @custom_field.destroy
    ReindexAllItemsWorker.perform_async(@lab.id, @custom_field.item_type)
    redirect_to admin_lab_custom_fields_path(@lab)
  end

  private

  def strong_params
    params[:custom_field][:options] ||= []

    params.require(:custom_field).permit(
      :item_type, :name, :field_type, :options => []
    )
  end

end
