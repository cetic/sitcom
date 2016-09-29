class OrganizationsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "organizations_#{params[:lab_id]}"
  end
end
