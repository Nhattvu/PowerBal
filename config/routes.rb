Rails.application.routes.draw do

  # homescreen
  root to: "main#index"
  
  # prize page
  get "prizes", to: "prizes#index"

  # about page
  get "about", to: "about#index"

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
