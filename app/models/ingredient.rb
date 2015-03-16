class Ingredient < ActiveRecord::Base


  validates :searchValue, uniqueness: true, presence: true
  validates :description, uniqueness: true, presence: true
  validates :term, uniqueness: true, presence: true


  def self.update_ingredients

    request = "http://api.yummly.com/v1/api/metadata/ingredient"

    options = {
      query:
      {
        _app_id: ENV['yummly_app_id'],
        _app_key: ENV['yummly_app_key']
      }
    }

    # cut off the beginning and end because jsonp adds some stuff json doesn't understand
    response = JSON.parse(HTTParty.get(request, options)[27..-3])

    # perform an "upsert" on each ingredient, i.e. update if it's there or create if not
    # there is definitely a better way to write this but this should work for now
    response.each do |ingredient|
      i_in_db = Ingredient.find_by(searchValue: ingredient["searchValue"])
      if i_in_db
        i_in_db.update_attributes(searchValue: ingredient["searchValue"],
                                  description: ingredient["description"],
                                  term: ingredient["term"])
      else
        Ingredient.create(searchValue: ingredient["searchValue"],
                          description: ingredient["description"],
                          term: ingredient["term"]);
      end
    end

  end

end
