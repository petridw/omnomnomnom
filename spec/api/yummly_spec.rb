require "rails_helper"

describe "Yummly API", :type => :request do
  let(:request_headers) { {"Accept" => "application/json", "Content-type" => "application/json"} }

  describe ".recipes" do
    it 'test call returns a list of recipes' do
      get '/api/recipes?keywords=test'

      expect(response).to have_http_status 200

      # Calling the api with keywords "test" returns a static page from github representing
      # a Yummly recipes api call. This result has 10 items in it.
      expect(json.count).to eq(10)
    end
  end

  describe ".recipe" do
    it 'test call returns a recipe' do
      get '/api/recipe?id=test'

      expect(response).to have_http_status 200

      expect(json['name']).to eq('Chili')
      expect(json['id']).to eq('Chili-339413')
    end
  end

  describe ".ingredients" do

    # Since the ingredients are created now, the api should just return the 3 ingredients
    # rather than hit the yummly api for new ones (it doesn't hit the api unless the 
    # ingredient that it checks is more than 2 weeks since its last update)
    it 'returns ingredients' do
      create(:ingredient, searchValue: 'egg', description: 'egg', term: 'egg')
      create(:ingredient, searchValue: 'tofu', description: 'tofu', term: 'tofu')
      create(:ingredient, searchValue: 'seitan', description: 'seitan', term: 'seitan')

      get '/api/ingredients'

      expect(response).to have_http_status 200

      expect(json.length).to eq(3)
    end
  end
  
end