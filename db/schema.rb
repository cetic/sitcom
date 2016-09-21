# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160921111134) do

  create_table "contact_event_links", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "contact_id"
    t.integer  "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_event_links_on_contact_id", using: :btree
    t.index ["event_id"], name: "index_contact_event_links_on_event_id", using: :btree
  end

  create_table "contact_field_links", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "contact_id"
    t.integer  "field_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_field_links_on_contact_id", using: :btree
    t.index ["field_id"], name: "index_contact_field_links_on_field_id", using: :btree
  end

  create_table "contact_organization_links", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "contact_id"
    t.integer  "organization_id"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.index ["contact_id"], name: "index_contact_organization_links_on_contact_id", using: :btree
    t.index ["organization_id"], name: "index_contact_organization_links_on_organization_id", using: :btree
  end

  create_table "contact_project_links", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "contact_id"
    t.integer  "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_project_links_on_contact_id", using: :btree
    t.index ["project_id"], name: "index_contact_project_links_on_project_id", using: :btree
  end

  create_table "contact_tag_links", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "contact_id"
    t.integer  "tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contact_id"], name: "index_contact_tag_links_on_contact_id", using: :btree
    t.index ["tag_id"], name: "index_contact_tag_links_on_tag_id", using: :btree
  end

  create_table "contacts", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.string   "last_name",        default: ""
    t.string   "first_name",       default: ""
    t.string   "email",            default: ""
    t.string   "address_street",   default: ""
    t.string   "address_zip_code", default: ""
    t.string   "address_city",     default: ""
    t.string   "address_country",  default: ""
    t.string   "phone",            default: ""
    t.boolean  "active",           default: false
    t.string   "twitter_url",      default: ""
    t.string   "linkedin_url",     default: ""
    t.string   "facebook_url",     default: ""
    t.string   "picture"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["lab_id"], name: "index_contacts_on_lab_id", using: :btree
  end

  create_table "events", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.string   "name"
    t.date     "happens_on"
    t.string   "place"
    t.text     "description", limit: 65535
    t.string   "website_url"
    t.string   "picture"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["lab_id"], name: "index_events_on_lab_id", using: :btree
  end

  create_table "fields", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "parent_id"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_id"], name: "index_fields_on_parent_id", using: :btree
  end

  create_table "lab_user_links", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.integer  "user_id"
    t.boolean  "can_read_contacts",       default: true
    t.boolean  "can_write_contacts",      default: false
    t.boolean  "can_read_organizations",  default: true
    t.boolean  "can_write_organizations", default: false
    t.boolean  "can_read_projects",       default: true
    t.boolean  "can_write_projects",      default: false
    t.boolean  "can_read_events",         default: true
    t.boolean  "can_write_events",        default: false
    t.datetime "created_at",                              null: false
    t.datetime "updated_at",                              null: false
    t.index ["lab_id"], name: "index_lab_user_links_on_lab_id", using: :btree
    t.index ["user_id"], name: "index_lab_user_links_on_user_id", using: :btree
  end

  create_table "labs", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.string   "name"
    t.string   "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notes", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "user_id"
    t.integer  "notable_id"
    t.string   "notable_type"
    t.text     "text",         limit: 65535
    t.string   "privacy"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.index ["notable_id"], name: "index_notes_on_notable_id", using: :btree
    t.index ["user_id"], name: "index_notes_on_user_id", using: :btree
  end

  create_table "organizations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.string   "name",                      default: ""
    t.string   "status",                    default: ""
    t.text     "description", limit: 65535
    t.string   "picture"
    t.string   "website_url",               default: ""
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.index ["lab_id"], name: "index_organizations_on_lab_id", using: :btree
  end

  create_table "projects", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.string   "name"
    t.text     "description", limit: 65535
    t.date     "start_date"
    t.date     "end_date"
    t.string   "picture"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.index ["lab_id"], name: "index_projects_on_lab_id", using: :btree
  end

  create_table "saved_searches", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.integer  "user_id"
    t.string   "name"
    t.text     "search",     limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
    t.index ["lab_id"], name: "index_saved_searches_on_lab_id", using: :btree
    t.index ["user_id"], name: "index_saved_searches_on_user_id", using: :btree
  end

  create_table "tags", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.integer  "lab_id"
    t.string   "name"
    t.string   "color"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["lab_id"], name: "index_tags_on_lab_id", using: :btree
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci" do |t|
    t.string   "name"
    t.boolean  "admin",                  default: false
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  add_foreign_key "contact_event_links", "contacts"
  add_foreign_key "contact_event_links", "events"
  add_foreign_key "contact_field_links", "contacts"
  add_foreign_key "contact_field_links", "fields"
  add_foreign_key "contact_organization_links", "contacts"
  add_foreign_key "contact_organization_links", "organizations"
  add_foreign_key "contact_project_links", "contacts"
  add_foreign_key "contact_project_links", "projects"
  add_foreign_key "contact_tag_links", "contacts"
  add_foreign_key "contact_tag_links", "tags"
  add_foreign_key "contacts", "labs"
  add_foreign_key "events", "labs"
  add_foreign_key "fields", "fields", column: "parent_id"
  add_foreign_key "lab_user_links", "labs"
  add_foreign_key "lab_user_links", "users"
  add_foreign_key "notes", "users"
  add_foreign_key "organizations", "labs"
  add_foreign_key "projects", "labs"
  add_foreign_key "saved_searches", "labs"
  add_foreign_key "saved_searches", "users"
  add_foreign_key "tags", "labs"
end
