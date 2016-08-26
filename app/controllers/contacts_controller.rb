class ContactsController < ApplicationController

  before_action :find_lab

  def index
    respond_to do |format|
      format.json do
        contacts = ContactSearch.new(params.merge({
          :lab_id => @lab.id
        })).run

        render :json => {
          :contacts => contacts
        }
      end

      format.html
    end
  end

  def show
    respond_to do |format|
      format.json do
        @contact = @lab.contacts.find(params[:id])
        render :json => @contact.as_indexed_json
      end

      format.html do
        render 'index'
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @contact = @lab.contacts.new(strong_params)

        if @contact.save
          @contact.index_dependent_rows
          render_json_success({ :contact => @contact.as_indexed_json })
        else
          render_json_errors(@contact)
        end
      end
    end
  end

  def update
    respond_to do |format|
      format.json do
        @contact = @lab.contacts.find(params[:id])

        if @contact.update_attributes(strong_params)
          @contact.index_dependent_rows
          render_json_success
        else
          render_json_errors(@contact)
        end
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
        @contact = @lab.contacts.find(params[:id])

        if @contact.destroy_and_index_dependent_rows
          render_json_success
        else
          render_json_errors(@contact)
        end
      end
    end
  end

  def options
    @contacts = @lab.contacts.order(:first_name, :last_name)
  end

  protected

  def strong_params
    params.require(:contact).permit(
      :first_name, :last_name, :active, :email, :phone,
      :address_street, :address_zip_code, :address_city, :address_country,
      :twitter_url, :linkedin_url, :facebook_url,
      :organization_ids => [],
      :field_ids        => [],
      :event_ids        => [],
      :project_ids      => []
    )
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
