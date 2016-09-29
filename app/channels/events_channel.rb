class EventsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "events_#{params[:lab_id]}"
  end
end
