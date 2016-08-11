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
      end

      format.html do
        render 'index'
      end
    end
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
