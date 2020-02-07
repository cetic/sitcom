describe 'Projects import' do

  before :each do
    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    Project.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'imports an XLSX file', js: true do
    visit new_lab_item_import_path(@lab, :item_type => 'project')

    expect(page).to have_content("Vous pouvez importer un ensemble de projets")

    click_button 'Analyser le fichier'

    expect(page).to have_content("Vous n'avez pas sélectionné de fichier.")
  end

  it 'imports an XLSX file' do
    xlsx_data = File.read("#{Rails.root}/spec/support/import/project-import.xlsx")

    import = ProjectImport.new(@lab, xlsx_data)

    import.parse
    import.commit

    expect(import.errors.length).to eq(0)
    expect(@lab.projects.length).to eq(2)
    expect(@lab.projects.map(&:name)).to eq(["Dossier de la semaine", "Projet de fusion des ressources"])
  end

end
