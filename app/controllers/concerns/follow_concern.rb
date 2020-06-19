module FollowConcern
  extend ActiveSupport::Concern

  def follow_status
    links = current_user.item_user_links.where(
      :item_id   => params[:id],
      :item_type => controller_name.singularize.capitalize
    )

    render :json => { :status => links.any? ? 'followed' : 'unfollowed' }
  end

  def follow
    current_user.item_user_links.find_or_create_by(
      :item_id   => params[:id],
      :item_type => controller_name.singularize.capitalize
    )

    render :json => { :status => 'followed' }
  end

  def unfollow
    current_user.item_user_links.where(
      :item_id   => params[:id],
      :item_type => controller_name.singularize.capitalize
    ).destroy_all

    render :json => { :status => 'unfollowed' }
  end
end
