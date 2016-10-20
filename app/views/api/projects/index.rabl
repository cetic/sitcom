object false

child @projects do
  collection @projects
  extends 'api/projects/project'
end

node :pagination do
  {
    :total => @projects.total_count,
    :pages => @projects.total_pages,
    :page  => @projects.current_page,
  }
end
