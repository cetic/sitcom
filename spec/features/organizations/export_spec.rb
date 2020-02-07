describe 'Organizations export', :download_file => true do

  before :each do
    Capybara.current_session.current_window.resize_to(1280, 800)

    DownloadHelpers.clear_downloads

    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    organization1 = FactoryBot.create(:organization, :lab => @lab, :name => 'Machin SRL')
    organization2 = FactoryBot.create(:organization, :lab => @lab, :name => 'Truc SA')

    contact1 = FactoryBot.create(:contact, :lab => @lab, :first_name => 'Indiana', :last_name => 'Jones')
    contact2 = FactoryBot.create(:contact, :lab => @lab, :first_name => 'Michael', :last_name => 'Corleone')

    event1 = FactoryBot.create(:event, :lab => @lab, :name => 'Bidule')
    event2 = FactoryBot.create(:event, :lab => @lab, :name => 'Machin')

    project1 = FactoryBot.create(:project, :lab => @lab, :name => 'Projet A')
    project2 = FactoryBot.create(:project, :lab => @lab, :name => 'Projet B')

    ContactOrganizationLink.create(:contact_id => contact1.id, :organization_id => organization2.id)
    ContactOrganizationLink.create(:contact_id => contact2.id, :organization_id => organization2.id)

    EventOrganizationLink.create(:organization_id => organization2.id, :event_id => event1.id)
    EventOrganizationLink.create(:organization_id => organization2.id, :event_id => event2.id)

    OrganizationProjectLink.create(:organization_id => organization2.id, :project_id => project1.id)
    OrganizationProjectLink.create(:organization_id => organization2.id, :project_id => project2.id)

    FactoryBot.create(:note, :notable => organization1, :privacy => :public,  :text => 'bla bla')

    Organization.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'exports an XLSX file', js: true do
    visit lab_organizations_path(@lab)

    within '.quick-search' do
      new_window = window_opened_by do
        find('.fa-file-excel-o').click
      end

      within_window new_window do
        expect(File.basename(DownloadHelpers.download_path)).to eq("organizations.xlsx")

        xlsx_data = File.read(DownloadHelpers.download_path)
        workbook  = RubyXL::Parser.parse_buffer(xlsx_data)
        worksheet = workbook.worksheets[0]

        expect(worksheet[1][0].value).to eq("Machin SRL")
        expect(worksheet[1][7].value).to eq(" — bla bla")

        expect(worksheet[2][0].value).to eq("Truc SA")
        expect(worksheet[2][4].value).to eq("Indiana Jones, Michael Corleone")
        expect(worksheet[2][5].value).to eq("Projet A, Projet B")
        expect(worksheet[2][6].value).to eq("Bidule, Machin")
      end
    end
  end

end
