Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    get '/recipes/:keywords' => 'yummly#recipes'
  end

end
