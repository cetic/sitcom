class Tag < ActiveRecord::Base

  # Associations

  belongs_to :lab

  has_many :contact_tag_links, :dependent => :destroy
  has_many :contacts,          :through   => :contact_tag_links

  # Validations

  validates :lab,  :presence => true
  validates :name, :presence => true

  validates_uniqueness_of :name, :scope => :lab_id

  def self.random_color(lab)
    lab_colors = lab.tags.collect(&:color)
    generator  = ColorGenerator.new(
      :saturation => 0.35,
      :value      => 0.9,
      :seed       => 42
    )

    color = ''

    loop do
      color = "#" + generator.create_hex
      break if !color.in?(lab_colors)
    end

    color
  end
end
