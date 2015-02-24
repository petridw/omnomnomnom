module Api
  class YummlyController < ApplicationController

    API_URL = "http://api.yummly.com/v1/api"

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
          maxResult: 500
        }
      }
      # render plain: "options: #{options}"

      response = HTTParty.get(request, options)
      render json: response.to_json
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