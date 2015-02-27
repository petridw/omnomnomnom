class Ingredient < ActiveRecord::Base


  validates :searchValue, uniqueness: true, presence: true
  validates :description, uniqueness: true, presence: true
  validates :term, uniqueness: true, presence: true


end
