object false

child @contacts do
  collection @contacts
  extends 'api/contacts/contact'
end

node :pagination do
  {
    :total => @contacts.total_count,
    :pages => @contacts.total_pages,
    :page  => @contacts.current_page,
  }
end
