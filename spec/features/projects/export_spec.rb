describe 'Projects export', :download_file => true do

  before :each do
    Capybara.current_session.current_window.resize_to(1280, 800)

    DownloadHelpers.clear_downloads

    @lab  = FactoryBot.create(:lab)
    @user = FactoryBot.create(:user, :labs => [@lab])

    project1 = FactoryBot.create(:project, :lab => @lab, :name => 'Projet A', :start_date => Date.yesterday)
    project2 = FactoryBot.create(:project, :lab => @lab, :name => 'Projet B', :start_date => Date.today)

    contact1 = FactoryBot.create(:contact, :lab => @lab, :first_name => 'Albert',  :last_name => 'Dupont')
    contact2 = FactoryBot.create(:contact, :lab => @lab, :first_name => 'Josiane', :last_name => 'Dubois')

    organization1 = FactoryBot.create(:organization, :lab => @lab, :name => 'Shell')
    organization2 = FactoryBot.create(:organization, :lab => @lab, :name => 'Q8')

    event1 = FactoryBot.create(:event, :lab => @lab, :name => 'Event A')
    event2 = FactoryBot.create(:event, :lab => @lab, :name => 'Event B')

    OrganizationProjectLink.create(:project_id => project2.id, :organization_id => organization1.id)
    OrganizationProjectLink.create(:project_id => project2.id, :organization_id => organization2.id)

    ContactProjectLink.create(:contact_id => contact1.id, :project_id => project2.id)
    ContactProjectLink.create(:contact_id => contact2.id, :project_id => project2.id)

    EventProjectLink.create(:event_id => event1.id, :project_id => project2.id)
    EventProjectLink.create(:event_id => event2.id, :project_id => project2.id)

    FactoryBot.create(:note, :notable => project1, :privacy => :public, :text => 'bla bla')

    Contact.__elasticsearch__.refresh_index!

    login_as @user
  end

  it 'exports an XLSX file', js: true do
    visit lab_projects_path(@lab)

    within '.quick-search' do
      new_window = window_opened_by do
        find('.fa-file-excel-o').click
      end

      within_window new_window do
        expect(File.basename(DownloadHelpers.download_path)).to eq("projects.xlsx")

        xlsx_data = File.read(DownloadHelpers.download_path)
        workbook  = RubyXL::Parser.parse_buffer(xlsx_data)
        worksheet = workbook.worksheets[0]

        expect(worksheet[1][0].value).to eq("Projet B")
        expect(worksheet[1][4].value).to eq("Albert Dupont, Josiane Dubois")
        expect(worksheet[1][5].value).to eq("Shell, Q8")
        expect(worksheet[1][6].value).to eq("Event A, Event B")

        expect(worksheet[2][0].value).to eq("Projet A")
        expect(worksheet[2][7].value).to eq(" — bla bla")
      end
    end
  end

end
