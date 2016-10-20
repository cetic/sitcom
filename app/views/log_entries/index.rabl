collection @log_entries

attributes :id #:user_id, :user_name, :action, :item_type, :item_id, :content, :created_at

node :text do |l|
  type_name = case l.item_type
    when 'Contact'      then "le contact"
    when 'Organization' then "l'organisation"
    when 'Project'      then "le projet"
    when 'Event'        then "l'événement"
  end

  if l.action == 'destroy'
    "#{l.user_name} a supprimé #{type_name}."
  elsif l.action == 'create'
    "#{l.user_name} a ajouté #{type_name}."
  elsif l.action == 'update'
    "#{l.user_name} a modifié #{type_name}."
  end
end

node :changes do |l|
  def translate(current_key, old_hash, new_hash, old_key, new_key)
    if current_key == old_key
      new_hash.merge!({ new_key => old_hash[old_key] })
      new_hash.delete(old_key)
    end
  end

  def translate_ids(current_key, old_hash, new_hash, klass, old_key, new_key)
    if current_key == old_key
      before_ids = old_hash[old_key].first
      after_ids  = old_hash[old_key].last

      new_hash.merge!({ new_key => [
          klass.where(:id => before_ids-after_ids).collect(&:name),
          klass.where(:id => after_ids-before_ids).collect(&:name)
        ]
      })

      new_hash.delete(old_key)
    end
  end

  changes = l.content.deep_dup

  l.content.keys.each do |key|
    if key == 'custom_field'
      changes.merge!(l.content['custom_field'])
      changes.delete('custom_field')
    end

    translate_ids(key, l.content, changes, Contact,      'contact_ids',      'Contacts')
    translate_ids(key, l.content, changes, Organization, 'organization_ids', 'Organisations')
    translate_ids(key, l.content, changes, Project,      'project_ids',      'Projets')
    translate_ids(key, l.content, changes, Event,        'event_ids',        'Événements')
    translate_ids(key, l.content, changes, Field,        'field_ids',        "Domaines d'expertise")
    translate_ids(key, l.content, changes, Tag,          'tag_ids',          'Groupes')

    translate(key, l.content, changes, 'last_name',        'Nom')
    translate(key, l.content, changes, 'first_name',       'Prénom')
    translate(key, l.content, changes, 'name',             'Nom')
    translate(key, l.content, changes, 'status',           'Statut')
    translate(key, l.content, changes, 'description',      'Description')
    translate(key, l.content, changes, 'email',            'Email')
    translate(key, l.content, changes, 'address_street',   'Rue')
    translate(key, l.content, changes, 'address_zip_code', 'Code postal')
    translate(key, l.content, changes, 'address_city',     'Ville')
    translate(key, l.content, changes, 'address_country',  'Pays')
    translate(key, l.content, changes, 'phone',            'Téléphone')
    translate(key, l.content, changes, 'active',           'Activité')
    translate(key, l.content, changes, 'twitter_url',      'Page Twitter')
    translate(key, l.content, changes, 'linkedin_url',     'Page Linkedin')
    translate(key, l.content, changes, 'facebook_url',     'Page Facebook')
    translate(key, l.content, changes, 'website_url',      'Site web')
    translate(key, l.content, changes, 'picture',          'Image')
    translate(key, l.content, changes, 'start_date',       'Date de début')
    translate(key, l.content, changes, 'end_date',         'Date de fin')
    translate(key, l.content, changes, 'happens_on',       'Date')
    translate(key, l.content, changes, 'place',            'Lieu')
    translate(key, l.content, changes, 'note',             'Note')
  end

  changes
end

