class ProjectsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "projects_#{params[:lab_id]}"
  end
end
