module Api
  class YummlyController < ApplicationController

    API_URL = "http://api.yummly.com/v1/api"
    MAX_RESULT = 250
    LIMIT_TO = 12

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

      if keywords == "test"
        request = "https://gist.githubusercontent.com/petridw/6b660cc8df76778feac6/raw/9633cf8ba7db96bed56e0072932326e3cd0328fd/yummly_example"
        response = JSON.parse(HTTParty.get(request))
      else
        response = HTTParty.get(request, options)
      end

      recipes = response['matches']
      recipes.sort! { |a,b| b['rating'] <=> a['rating'] }

      # set up a few extra key/value pairs which will be used by angular
      recipes_short_list = recipes.take(LIMIT_TO)
      recipes_short_list.each do |recipe|
        recipe['isSelected'] = false
        recipe['isLoading'] = false
        recipe['expandedInfo'] = nil
      end

      render json: recipes_short_list.to_json

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
  end
end