class ContactsController < ApplicationController

  before_action :find_lab
  before_action :clean_params, :only => [:update] # for dropzone

  def index
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('contacts')
          contacts = ContactSearch.new(current_user, params.merge({
            :lab_id => @lab.id
          })).run

          if params[:only_ids]
            render :json => {
              :contact_ids => contacts
            }
          else
            render :json => {
              :contacts => contacts
            }
          end
        else
          render_permission_error
        end
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        if PermissionsService.new(current_user, @lab).can_read?('contacts')
          @contact = @lab.contacts.find(params[:id])
          render :json => BaseSearch.reject_private_notes_from_result(@contact.as_indexed_json)
        else
          render_permission_error
        end
      end

      format.html do
        render './shared/routes'
      end
    end
  end

  def create
    if PermissionsService.new(current_user, @lab).can_write?('contacts')
      respond_to do |format|
        format.json do
          @contact = @lab.contacts.new(strong_params)

          if @contact.save
            LogEntry.log_create(current_user, @contact)

            render_json_success({ :contact_id => @contact.id })
          else
            render_json_errors(@contact)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def update
    if PermissionsService.new(current_user, @lab).can_write?('contacts')
      respond_to do |format|
        format.json do
          @contact                 = @lab.contacts.find(params[:id])
          previous_association_ids = @contact.association_ids

          if @contact.update_attributes(strong_params)
            LogEntry.log_update(current_user, @contact, previous_association_ids)
            cleanup_orphan_tags

            render_json_success
          else
            render_json_errors(@contact)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def destroy
    if PermissionsService.new(current_user, @lab).can_write?('contacts')
      respond_to do |format|
        format.json do
          @contact                 = @lab.contacts.find(params[:id])
          previous_association_ids = @contact.association_ids

          if @contact.destroy
            LogEntry.log_destroy(current_user, @contact, previous_association_ids)
            cleanup_orphan_tags

            render_json_success
          else
            render_json_errors(@contact)
          end
        end
      end
    else
      render_permission_error
    end
  end

  def options
    @contacts = @lab.contacts.order(:first_name, :last_name)
  end

  def export
    if PermissionsService.new(current_user, @lab).can_read?('contacts')
      contacts = ContactSearch.new(current_user, params.merge({
        :lab_id => @lab.id
      })).run

      render_csv(ContactExport.new(@lab, contacts).csv_data, 'contacts.csv')
    else
      render_permission_error
    end
  end

  def mailchimp_export
    if PermissionsService.new(current_user, @lab).can_write?('contacts')
      contacts = ContactSearch.new(current_user, params.merge({
        :lab_id => @lab.id
      })).run

      Mailchimp::CreateListFromContactsWorker.perform_async(@lab.id, params[:list_name], contacts.map(&:id))

      render :nothing => true
    else
      render_permission_error
    end
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
      :project_ids      => [],
      :event_ids        => [],
      :field_ids        => [],
      :tag_ids          => []
    )
  end

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end

  def cleanup_orphan_tags
    ContactTagService.cleanup_orphan_tags(@lab)
  end
end
