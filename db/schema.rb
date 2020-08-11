# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_08_06_124519) do

  create_table "contact_event_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "contact_id"
    t.string "role", default: ""
    t.integer "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_event_links_on_contact_id"
    t.index ["event_id"], name: "index_contact_event_links_on_event_id"
  end

  create_table "contact_field_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "contact_id"
    t.integer "field_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_field_links_on_contact_id"
    t.index ["field_id"], name: "index_contact_field_links_on_field_id"
  end

  create_table "contact_organization_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "contact_id"
    t.string "role", default: ""
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_organization_links_on_contact_id"
    t.index ["organization_id"], name: "index_contact_organization_links_on_organization_id"
  end

  create_table "contact_project_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "contact_id"
    t.string "role", default: ""
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_project_links_on_contact_id"
    t.index ["project_id"], name: "index_contact_project_links_on_project_id"
  end

  create_table "contacts", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.string "last_name", default: ""
    t.string "first_name", default: ""
    t.string "email", default: ""
    t.string "address_street", default: ""
    t.string "address_zip_code", default: ""
    t.string "address_city", default: ""
    t.string "address_country", default: ""
    t.string "phone", default: ""
    t.boolean "active", default: false
    t.string "twitter_url", default: ""
    t.string "linkedin_url", default: ""
    t.string "facebook_url", default: ""
    t.string "picture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_contacts_on_lab_id"
  end

  create_table "custom_field_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "custom_field_id"
    t.string "item_type"
    t.integer "item_id"
    t.text "text_value"
    t.boolean "bool_value", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["custom_field_id"], name: "index_custom_field_links_on_custom_field_id"
    t.index ["item_id"], name: "index_custom_field_links_on_item_id"
    t.index ["item_type"], name: "index_custom_field_links_on_item_type"
  end

  create_table "custom_fields", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.string "item_type", default: "Contact"
    t.string "name"
    t.string "field_type"
    t.integer "position"
    t.text "options"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_type"], name: "index_custom_fields_on_item_type"
    t.index ["lab_id"], name: "index_custom_fields_on_lab_id"
  end

  create_table "documents", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "user_id"
    t.integer "uploadable_id"
    t.string "uploadable_type"
    t.string "file"
    t.text "description"
    t.string "privacy"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uploadable_id"], name: "index_documents_on_uploadable_id"
    t.index ["user_id"], name: "index_documents_on_user_id"
  end

  create_table "event_organization_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "event_id"
    t.string "role", default: ""
    t.integer "organization_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_organization_links_on_event_id"
    t.index ["organization_id"], name: "index_event_organization_links_on_organization_id"
  end

  create_table "event_project_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "event_id"
    t.string "role", default: ""
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_project_links_on_event_id"
    t.index ["project_id"], name: "index_event_project_links_on_project_id"
  end

  create_table "events", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.string "name"
    t.date "happens_on"
    t.string "place"
    t.text "description"
    t.string "website_url"
    t.string "picture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_events_on_lab_id"
  end

  create_table "fields", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.integer "parent_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_fields_on_lab_id"
    t.index ["parent_id"], name: "index_fields_on_parent_id"
  end

  create_table "item_tag_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "item_id"
    t.string "item_type", default: "Contact"
    t.integer "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_item_tag_links_on_item_id"
    t.index ["tag_id"], name: "index_item_tag_links_on_tag_id"
  end

  create_table "item_user_links", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "user_id"
    t.integer "item_id"
    t.string "item_type", default: "Contact"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_item_user_links_on_item_id"
    t.index ["item_type"], name: "index_item_user_links_on_item_type"
    t.index ["user_id"], name: "index_item_user_links_on_user_id"
  end

  create_table "lab_user_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.integer "user_id"
    t.boolean "can_read_contacts", default: true
    t.boolean "can_write_contacts", default: false
    t.boolean "can_read_organizations", default: true
    t.boolean "can_write_organizations", default: false
    t.boolean "can_read_projects", default: true
    t.boolean "can_write_projects", default: false
    t.boolean "can_read_events", default: true
    t.boolean "can_write_events", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_lab_user_links_on_lab_id"
    t.index ["user_id"], name: "index_lab_user_links_on_user_id"
  end

  create_table "labs", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.string "mailchimp_api_key"
    t.string "mailchimp_company"
    t.string "mailchimp_from_email"
    t.string "mailchimp_address1"
    t.string "mailchimp_address2"
    t.string "mailchimp_city"
    t.string "mailchimp_state"
    t.string "mailchimp_zip"
    t.string "mailchimp_country"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "vat_number", default: ""
    t.string "address1", default: ""
    t.string "address2", default: ""
    t.string "city", default: ""
    t.string "state", default: ""
    t.string "zip", default: ""
    t.string "country", default: ""
    t.string "account_type", default: "basic"
  end

  create_table "log_entries", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.integer "user_id"
    t.string "user_name"
    t.string "action"
    t.string "item_type"
    t.integer "item_id"
    t.string "item_name", default: ""
    t.text "content", size: :long
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_log_entries_on_item_id"
    t.index ["item_type"], name: "index_log_entries_on_item_type"
    t.index ["lab_id"], name: "index_log_entries_on_lab_id"
    t.index ["user_id"], name: "index_log_entries_on_user_id"
  end

  create_table "notes", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "user_id"
    t.integer "notable_id"
    t.string "notable_type"
    t.string "name"
    t.text "text"
    t.string "privacy"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notable_id"], name: "index_notes_on_notable_id"
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "organization_project_links", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "organization_id"
    t.string "role", default: ""
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_organization_project_links_on_organization_id"
    t.index ["project_id"], name: "index_organization_project_links_on_project_id"
  end

  create_table "organizations", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.string "name", default: ""
    t.string "status", default: ""
    t.text "description"
    t.string "picture"
    t.string "website_url", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "company_number", default: ""
    t.string "address1", default: ""
    t.string "address2", default: ""
    t.string "city", default: ""
    t.string "state", default: ""
    t.string "zip", default: ""
    t.string "country", default: ""
    t.string "twitter_url", default: ""
    t.string "facebook_url", default: ""
    t.string "linkedin_url", default: ""
    t.index ["lab_id"], name: "index_organizations_on_lab_id"
  end

  create_table "projects", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.string "name"
    t.text "description"
    t.date "start_date"
    t.date "end_date"
    t.string "picture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_projects_on_lab_id"
  end

  create_table "saved_searches", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.integer "user_id"
    t.string "name"
    t.string "item_type"
    t.text "search"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_saved_searches_on_lab_id"
    t.index ["user_id"], name: "index_saved_searches_on_user_id"
  end

  create_table "tags", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.integer "lab_id"
    t.string "name"
    t.string "color"
    t.string "item_type", default: "Contact"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_tags_on_lab_id"
  end

  create_table "tasks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "item_type"
    t.bigint "item_id"
    t.bigint "user_id"
    t.string "name"
    t.text "text"
    t.date "execution_date"
    t.datetime "done_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_type", "item_id"], name: "index_tasks_on_item_type_and_item_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", id: :integer, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci", force: :cascade do |t|
    t.string "name"
    t.boolean "admin", default: false
    t.boolean "lab_manager", default: false
    t.string "email", default: "", null: false
    t.string "api_key"
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "last_seen_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["last_seen_at"], name: "index_users_on_last_seen_at"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "contact_event_links", "contacts"
  add_foreign_key "contact_event_links", "events"
  add_foreign_key "contact_field_links", "contacts"
  add_foreign_key "contact_field_links", "fields"
  add_foreign_key "contact_organization_links", "contacts"
  add_foreign_key "contact_organization_links", "organizations"
  add_foreign_key "contact_project_links", "contacts"
  add_foreign_key "contact_project_links", "projects"
  add_foreign_key "contacts", "labs"
  add_foreign_key "custom_field_links", "custom_fields"
  add_foreign_key "custom_fields", "labs"
  add_foreign_key "documents", "users"
  add_foreign_key "event_organization_links", "events"
  add_foreign_key "event_organization_links", "organizations"
  add_foreign_key "event_project_links", "events"
  add_foreign_key "event_project_links", "projects"
  add_foreign_key "events", "labs"
  add_foreign_key "fields", "fields", column: "parent_id"
  add_foreign_key "item_tag_links", "tags"
  add_foreign_key "item_user_links", "users"
  add_foreign_key "lab_user_links", "labs"
  add_foreign_key "lab_user_links", "users"
  add_foreign_key "log_entries", "labs"
  add_foreign_key "log_entries", "users"
  add_foreign_key "notes", "users"
  add_foreign_key "organization_project_links", "organizations"
  add_foreign_key "organization_project_links", "projects"
  add_foreign_key "organizations", "labs"
  add_foreign_key "projects", "labs"
  add_foreign_key "saved_searches", "labs"
  add_foreign_key "saved_searches", "users"
  add_foreign_key "tags", "labs"
end
