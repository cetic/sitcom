class ContactsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

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

      format.html do
        render './shared/routes'
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        @contact = @lab.contacts.find(params[:id])
        render :json => @contact.as_indexed_json
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    respond_to do |format|
      format.json do
        @contact = @lab.contacts.new(strong_params)

        if @contact.save
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

        if @contact.destroy
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

  private

  # Encapsulate new picture in "contact" (don't know how to make it in JS)
  def clean_params
    params[:contact] ||= {}
    params[:contact][:picture] = params[:picture]
    params.delete(:picture)
  end

  def strong_params
    params.require(:contact).permit(
      :first_name, :last_name, :active, :email, :phone,
      :address_street, :address_zip_code, :address_city, :address_country,
      :twitter_url, :linkedin_url, :facebook_url,
      :picture,
      :organization_ids => [],
      :field_ids        => [],
      :event_ids        => [],
      :project_ids      => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
