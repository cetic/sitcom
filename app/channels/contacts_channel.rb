class ContactsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "contacts_#{params[:lab_id]}"
  end
end
