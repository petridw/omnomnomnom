module Api
  class YummlyController < ApplicationController

    API_URL = "http://api.yummly.com/v1/api"
    MAX_RESULT = 500
    LIMIT_TO = 500

    def recipes

      if params[:keywords]
        keywords = URI.encode(params[:keywords])
      else
        keywords = ""
      end

      if params[:ingredients]
        ingredients = params[:ingredients]
      else
        ingredients = []
      end

      request = "#{API_URL}/recipes"
      options = { 
        query: 
        {
          _app_id: ENV['yummly_app_id'],
          _app_key: ENV['yummly_app_key'],
          q: keywords,
          allowedIngredient: ingredients,
          maxResult: MAX_RESULT
        }
      }

      begin

        if keywords == "test"
          # for testing the api without actually calling yummly
          request = "https://gist.githubusercontent.com/petridw/6b660cc8df76778feac6/raw/9633cf8ba7db96bed56e0072932326e3cd0328fd/yummly_example"
          response = JSON.parse(HTTParty.get(request))
        else
          response = HTTParty.get(request, options)
        end

        recipes = response['matches']
        recipes.sort! { |a,b| b['rating'] <=> a['rating'] }

        # set up a few extra key/value pairs which will be used by angular
        recipes = recipes.take(LIMIT_TO)
        recipes.each do |recipe|
          recipe['isSelected'] = false
          recipe['isLoading'] = false
          recipe['expandedInfo'] = nil
        end

      rescue Zlib::DataError => e
        recipes = e.inspect
      rescue Exception => e
        recipes = "Error: #{e}"
      end

      render json: recipes.to_json

      # alternate render for testing that proper params are being passed in from angular:
      # render json: params.inspect.to_json
    end

    def recipe

      request = "#{API_URL}/recipe/#{params[:id]}"
      options = {
        query:
        {
          _app_id: ENV['yummly_app_id'],
          _app_key: ENV['yummly_app_key']
        }
      }

      response = HTTParty.get(request, options)
      render json: response.to_json

    end

    # Renders all ingredients from Postgres DB as JSON
    # if the database was last updated over a week ago then it updates the DB by calling the yummly api
    # !!! currently, it takes a good 30 seconds to fully update the DB
    #     change this so that the update happens in a background task!
    def ingredients

      ingredient = Ingredient.first

      # if data is over 1 week old (604800 seconds in week)
      if ingredient == nil || ((Time.now.to_i - ingredient.updated_at.to_i) > 604800)

        request = "#{API_URL}/metadata/ingredient"
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

      # render json of all ingredients in our DB, which should now be updated
      render json: Ingredient.all.to_json(except: [:created_at, :updated_at])

    end

  end
end