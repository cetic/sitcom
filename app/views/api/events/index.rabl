object false

child @events do
  collection @events
  extends 'api/events/event'
end

node :pagination do
  {
    :total => @events.total_count,
    :pages => @events.total_pages,
    :page  => @events.current_page,
  }
end
