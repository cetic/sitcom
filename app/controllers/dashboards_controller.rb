class DashboardsController < ApplicationController

  before_action :find_lab

  def show
    respond_to do |format|
      format.html do
        render './shared/routes'
      end
    end
  end

  def metrics
    render :json => {
      :contacts      => @lab.contacts.count,
      :organizations => @lab.organizations.count,
      :projects      => @lab.projects.count,
      :events        => @lab.events.count
    }
  end

  def events
    if PermissionsService.new(current_user, @lab).can_read?('events')
      @events = @lab.events.where('happens_on IS NOT NULL')
                           .where('happens_on >= ?', Time.now)
                           .order(:happens_on => :asc)
                           .includes(:contacts, :organizations)
                           .limit(10)
    else
      @events = []
    end

    @event_hashes = @events.collect do |event|
      {
        :id                  => event.id,
        :name                => event.name,
        :path                => event.path,
        :happens_on          => event.happens_on.strftime("%d/%m/%Y"),
        :place               => event.place,
        :description         => event.description,
        :picture_url         => event.picture_url(:thumb),
        :organizations_count => event.organization_ids.size,
        :contacts_count      => event.contact_ids.size
      }
    end

    render :json => { :events => @event_hashes }
  end

  def monthly_connections
    hash = YAML.load(@lab.stats)

    min_date     = hash.keys.min
    max_date     = Date.today.beginning_of_month
    current_date = min_date.dup

    while current_date < max_date
      hash[current_date] = 0 if !hash[current_date]
      current_date = current_date + 1.month
    end

    render :json => { :monthly_connections => hash }
  end

  def log_entries
    item_types = ['Contact', 'Organization', 'Event', 'Project']

    permitted_item_types = item_types.select do |item_type|
      PermissionsService.new(current_user, @lab).can_read?(item_type.downcase.pluralize)
    end

    @log_entries = @lab.log_entries.where(:item_type => permitted_item_types)
                       .limit(20)
                       .order(:created_at => :desc)

    render 'log_entries/index'
  end

  def online_users
    render :json => {
      :online_users => @lab.users.online.order(:name => :asc)
                                        .collect { |user| user.slice(:name, :id, :last_seen_at, :last_seen_at_ago) }
    }
  end

  private

  def find_lab
    @lab = current_user.labs.find_by_slug!(params[:lab_id])
    save_lab_in_cookies(@lab)
  end
end
