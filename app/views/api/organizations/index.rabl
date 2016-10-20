object false

child @organizations do
  collection @organizations
  extends 'api/organizations/organization'
end

node :pagination do
  {
    :total => @organizations.total_count,
    :pages => @organizations.total_pages,
    :page  => @organizations.current_page,
  }
end
