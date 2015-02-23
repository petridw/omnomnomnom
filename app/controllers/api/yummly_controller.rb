module Api
  class YummlyController < ApplicationController

    API_URL = "http://api.yummly.com/v1/api"

    def recipes

      if params[:keywords]
        keywords = URI.encode(params[:keywords])
      else
        keywords = ""
      end

      recipe_request = "#{API_URL}/recipes"
      options = { 
        query: 
        {
          _app_id: ENV['yummly_app_id'],
          _app_key: ENV['yummly_app_key'],
          q: keywords
        }
      }

      response = HTTParty.get(recipe_request, options)
      render json: response.to_json
    end
  end
end