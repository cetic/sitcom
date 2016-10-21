collection @log_entries

attributes :id #:user_id, :user_name, :action, :item_type, :item_id, :content, :created_at

node :name do |l|
  l.user_name
end

node :action do |l|
  if l.action == 'destroy'
    "a supprimé"
  elsif l.action == 'create'
    "a ajouté"
  elsif l.action == 'update'
    "a modifié"
  end
end

node :target do |l|
  case l.item_type
    when 'Contact'      then "le contact"
    when 'Organization' then "l'organisation"
    when 'Project'      then "le projet"
    when 'Event'        then "l'événement"
  end
end

node :on do |l|
  l.updated_at.strftime('%d/%m/%Y à %H:%M')
end

node :ago do |l|
  "il y a #{time_ago_in_words(l.updated_at)}"
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

    # deal with boolean values
    changes.each do |k, v|
      changes[k][0] = 'Oui' if changes[k] && changes[k][0] == true
      changes[k][0] = 'Non' if changes[k] && changes[k][0] == false
      changes[k][1] = 'Oui' if changes[k] && changes[k][1] == true
      changes[k][1] = 'Non' if changes[k] && changes[k][1] == false
    end
  end

  changes
end
