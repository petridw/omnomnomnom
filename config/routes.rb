Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    get '/recipes' => 'yummly#recipes'
  end

end
